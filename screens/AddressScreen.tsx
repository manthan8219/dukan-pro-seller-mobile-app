import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useAddress } from '../context/AddressContext';
import type { Address, AddressFormData } from '../models/Address';

type LabelTag = 'home' | 'office' | 'other';

const LABEL_ICONS: Record<string, any> = {
  home: 'home',
  office: 'work',
  work: 'work',
  other: 'place',
};

function getIcon(label: string): any {
  return LABEL_ICONS[label.toLowerCase()] ?? 'place';
}

/** Map saved label string back to tag + optional custom text for "Other". */
function parseStoredLabel(stored: string): { tag: LabelTag; otherText: string } {
  const t = stored.trim().toLowerCase();
  if (t === 'home') return { tag: 'home', otherText: '' };
  if (t === 'office' || t === 'work') return { tag: 'office', otherText: '' };
  return { tag: 'other', otherText: stored.trim() };
}

function resolveLabel(tag: LabelTag, otherText: string): string {
  if (tag === 'home') return 'Home';
  if (tag === 'office') return 'Office';
  return otherText.trim();
}

const EMPTY_FORM: AddressFormData = {
  fullName: '',
  phone: '',
  label: '',
  street: '',
  city: '',
  zip: '',
  latitude: null,
  longitude: null,
};

export default function AddressScreen({ navigation }: any) {
  const {
    addresses,
    activeAddress,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setActiveAddress,
  } = useAddress();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [labelTag, setLabelTag] = useState<LabelTag>('home');
  const [otherLabelText, setOtherLabelText] = useState('');
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setLabelTag('home');
    setOtherLabelText('');
    setEditingId(null);
    setMode('add');
  };

  const openEdit = (address: Address) => {
    const { tag, otherText } = parseStoredLabel(address.label);
    setLabelTag(tag);
    setOtherLabelText(otherText);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      label: address.label,
      street: address.street,
      city: address.city,
      zip: address.zip,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setEditingId(address.id);
    setMode('edit');
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Enable location access in Settings to use this feature.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;

      // Reverse-geocode to fill in the address fields
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (place) {
        setForm((f) => ({
          ...f,
          street: [place.streetNumber, place.street].filter(Boolean).join(' ') || f.street,
          city: place.city || place.subregion || f.city,
          zip: place.postalCode || f.zip,
          latitude,
          longitude,
        }));
      } else {
        setForm((f) => ({ ...f, latitude, longitude }));
      }
    } catch (err) {
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    const resolvedLabel = resolveLabel(labelTag, otherLabelText);
    if (labelTag === 'other' && !resolvedLabel) {
      Alert.alert('Missing label', 'Please enter a name for this address.');
      return;
    }
    if (!form.fullName.trim() || !form.phone.trim()) {
      Alert.alert('Missing fields', 'Please enter your full name and phone number.');
      return;
    }
    if (!form.street.trim() || !form.city.trim() || !form.zip.trim()) {
      Alert.alert('Missing fields', 'Please fill in street, city, and PIN code.');
      return;
    }
    const payload: AddressFormData = { ...form, label: resolvedLabel };
    setSaving(true);
    try {
      if (mode === 'edit' && editingId) {
        await updateAddress(editingId, payload);
      } else {
        await addAddress(payload);
      }
      setMode('list');
    } catch {
      Alert.alert('Error', 'Could not save the address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, label: string) => {
    Alert.alert('Delete Address', `Remove "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(id) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#006670" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (mode === 'list' ? navigation.goBack() : setMode('list'))}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'list' ? 'Delivery Addresses' : mode === 'add' ? 'New Address' : 'Edit Address'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {mode === 'list' ? (
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <TouchableOpacity style={styles.addButton} onPress={openAdd}>
              <MaterialIcons name="add" size={24} color="#006670" />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>

            {addresses.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons name="location-off" size={48} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No addresses yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add a delivery address to see shops near you.
                </Text>
              </View>
            )}

            {addresses.map((address) => {
              const isActive = address.id === activeAddress?.id;
              const hasCoords = address.latitude != null && address.longitude != null;
              return (
                <Animated.View
                  key={address.id}
                  entering={FadeInDown.delay(100).springify()}
                  style={isActive ? styles.addressCardActive : styles.addressCard}
                >
                  <View style={styles.addressCardRow}>
                    <TouchableOpacity
                      style={styles.addressCardLeft}
                      onPress={() => !isActive && setActiveAddress(address.id)}
                      activeOpacity={isActive ? 1 : 0.7}
                    >
                      <MaterialIcons
                        name={getIcon(address.label)}
                        size={24}
                        color={isActive ? '#006670' : '#64748b'}
                      />
                      <View style={styles.addressContent}>
                        <View style={styles.addressLabelRow}>
                          <Text style={[styles.addressType, isActive && styles.addressTypeActive]}>
                            {address.label}
                          </Text>
                          {isActive && (
                            <View style={styles.activeBadge}>
                              <Text style={styles.activeBadgeText}>Active</Text>
                            </View>
                          )}
                          {hasCoords && (
                            <View style={styles.gpsBadge}>
                              <MaterialIcons name="gps-fixed" size={10} color="#0f766e" />
                              <Text style={styles.gpsBadgeText}>GPS</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.addressText}>
                          {address.fullName ? `${address.fullName}\n` : ''}{address.street}{'\n'}{address.city}, {address.zip}
                        </Text>
                        {!!address.phone && (
                          <Text style={styles.addressPhone}>{address.phone}</Text>
                        )}
                        {!isActive && (
                          <TouchableOpacity onPress={() => setActiveAddress(address.id)}>
                            <Text style={styles.setActiveLink}>Set as active</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>

                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.actionButton} onPress={() => openEdit(address)}>
                        <MaterialIcons name="edit" size={20} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(address.id, address.label)}
                      >
                        <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.springify()}>
            {/* GPS capture */}
            <TouchableOpacity
              style={[styles.gpsButton, locating && styles.gpsButtonDisabled]}
              onPress={handleUseCurrentLocation}
              disabled={locating}
            >
              {locating ? (
                <ActivityIndicator size="small" color="#006670" />
              ) : (
                <MaterialIcons name="gps-fixed" size={20} color="#006670" />
              )}
              <Text style={styles.gpsButtonText}>
                {locating ? 'Getting location…' : 'Use current GPS location'}
              </Text>
            </TouchableOpacity>

            {form.latitude != null && (
              <View style={styles.coordsRow}>
                <MaterialIcons name="check-circle" size={14} color="#0f766e" />
                <Text style={styles.coordsText}>
                  GPS captured: {form.latitude.toFixed(5)}, {form.longitude!.toFixed(5)}
                </Text>
              </View>
            )}

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or enter manually</Text>
              <View style={styles.divider} />
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Rahul Sharma"
              placeholderTextColor="#94a3b8"
              value={form.fullName}
              onChangeText={(v) => setForm((f) => ({ ...f, fullName: v }))}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94a3b8"
              value={form.phone}
              onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Label</Text>
            <View style={styles.labelTagRow}>
              {(
                [
                  { tag: 'home' as const, title: 'Home' },
                  { tag: 'office' as const, title: 'Office' },
                  { tag: 'other' as const, title: 'Other' },
                ] as const
              ).map(({ tag, title }) => {
                const selected = labelTag === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.labelTag, selected && styles.labelTagSelected]}
                    onPress={() => setLabelTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.labelTagText, selected && styles.labelTagTextSelected]}>{title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {labelTag === 'other' ? (
              <>
                <Text style={[styles.label, { marginTop: 4 }]}>Custom name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mom's place, Gym"
                  placeholderTextColor="#94a3b8"
                  value={otherLabelText}
                  onChangeText={setOtherLabelText}
                />
              </>
            ) : null}

            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main St"
              placeholderTextColor="#94a3b8"
              value={form.street}
              onChangeText={(v) => setForm((f) => ({ ...f, street: v }))}
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="New Delhi"
              placeholderTextColor="#94a3b8"
              value={form.city}
              onChangeText={(v) => setForm((f) => ({ ...f, city: v }))}
            />

            <Text style={styles.label}>Zip / Pin Code</Text>
            <TextInput
              style={styles.input}
              placeholder="110001"
              placeholderTextColor="#94a3b8"
              value={form.zip}
              onChangeText={(v) => setForm((f) => ({ ...f, zip: v }))}
              keyboardType="numeric"
            />

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setMode('list')}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3fe',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 24 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2f1',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#99f6e4',
    borderStyle: 'dashed',
  },
  addButtonText: { fontSize: 16, fontWeight: '600', color: '#006670', marginLeft: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334155' },
  emptySubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  addressCardActive: {
    backgroundColor: '#f1f3fe',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#006670',
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  addressCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  addressCardLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  addressContent: { flex: 1 },
  addressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  addressType: { fontWeight: '700', fontSize: 15, color: '#181c23' },
  addressTypeActive: { color: '#006670' },
  activeBadge: {
    backgroundColor: '#006670',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gpsBadgeText: { color: '#0f766e', fontSize: 10, fontWeight: '700' },
  addressText: { color: '#475569', fontSize: 14, lineHeight: 22 },
  addressPhone: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  setActiveLink: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#006670' },
  cardActions: { flexDirection: 'row', gap: 4, marginLeft: 8 },
  actionButton: { padding: 6 },
  // Form
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e0f2f1',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  gpsButtonDisabled: { opacity: 0.6 },
  gpsButtonText: { fontSize: 15, fontWeight: '600', color: '#006670' },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  coordsText: { fontSize: 12, color: '#0f766e', fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  labelTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  labelTag: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  labelTagSelected: {
    borderColor: '#006670',
    backgroundColor: '#e0f2f1',
  },
  labelTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  labelTagTextSelected: {
    color: '#006670',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 20,
  },
  formActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: '#475569' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#006670',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
});
