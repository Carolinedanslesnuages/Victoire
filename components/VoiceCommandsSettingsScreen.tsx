/**
 * Voice Commands Settings Component
 * Allows users to manage custom voice command phrases for Siri and Google Assistant
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../utils/i18n';
import {
  loadVoiceCommandSettings,
  saveVoiceCommandSettings,
  addVoiceCommandPhrase,
  updateVoiceCommandPhrase,
  deleteVoiceCommandPhrase,
} from '../utils/voiceCommands';
import { VoiceCommandPhrase, VoiceCommandSettings } from '../types';
import { isSiriShortcutsAvailable, getSiriSetupInstructions } from '../utils/siriShortcuts';

interface VoiceCommandsSettingsScreenProps {
  visible: boolean;
  onClose: () => void;
  customCategories: string[];
}

export default function VoiceCommandsSettingsScreen({
  visible,
  onClose,
  customCategories,
}: VoiceCommandsSettingsScreenProps) {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<VoiceCommandSettings | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<VoiceCommandPhrase | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Form state
  const [phraseText, setPhraseText] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    const loadedSettings = await loadVoiceCommandSettings();
    setSettings(loadedSettings);
  };

  const handleToggleEnabled = async () => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      enabled: !settings.enabled,
    };

    const success = await saveVoiceCommandSettings(updatedSettings);
    if (success) {
      setSettings(updatedSettings);
    }
  };

  const handleAddPhrase = () => {
    setEditingPhrase(null);
    setPhraseText('');
    setAmount('');
    setDescription('');
    setCategory('');
    setShowAddModal(true);
  };

  const handleEditPhrase = (phrase: VoiceCommandPhrase) => {
    setEditingPhrase(phrase);
    setPhraseText(phrase.phrase);
    setAmount(phrase.amount.toString());
    setDescription(phrase.description);
    setCategory(phrase.category || '');
    setShowAddModal(true);
  };

  const handleSavePhrase = async () => {
    // Validation
    if (!phraseText.trim()) {
      Alert.alert(i18n.t('voiceCommands.errors.title'), i18n.t('voiceCommands.errors.emptyPhrase'));
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(i18n.t('voiceCommands.errors.title'), i18n.t('voiceCommands.errors.invalidAmount'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(i18n.t('voiceCommands.errors.title'), i18n.t('voiceCommands.errors.emptyDescription'));
      return;
    }

    let success = false;

    if (editingPhrase) {
      // Update existing phrase
      success = await updateVoiceCommandPhrase(editingPhrase.id, {
        phrase: phraseText.trim(),
        amount: parsedAmount,
        description: description.trim(),
        category: category.trim() || undefined,
      });
    } else {
      // Add new phrase
      const newPhrase = await addVoiceCommandPhrase({
        phrase: phraseText.trim(),
        amount: parsedAmount,
        description: description.trim(),
        category: category.trim() || undefined,
      });
      success = newPhrase !== null;
    }

    if (success) {
      Alert.alert(
        i18n.t('voiceCommands.success'),
        editingPhrase ? i18n.t('voiceCommands.phraseUpdated') : i18n.t('voiceCommands.phraseAdded')
      );
      setShowAddModal(false);
      loadSettings();
    }
  };

  const handleDeletePhrase = (phrase: VoiceCommandPhrase) => {
    Alert.alert(
      i18n.t('voiceCommands.deleteConfirm.title'),
      i18n.t('voiceCommands.deleteConfirm.message'),
      [
        {
          text: i18n.t('voiceCommands.deleteConfirm.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('voiceCommands.deleteConfirm.confirm'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteVoiceCommandPhrase(phrase.id);
            if (success) {
              Alert.alert(i18n.t('voiceCommands.success'), i18n.t('voiceCommands.phraseDeleted'));
              loadSettings();
            }
          },
        },
      ]
    );
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const renderInstructions = () => {
    const instructions = getSiriSetupInstructions();
    return (
      <View style={[styles.instructionsContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
          {i18n.t('voiceCommands.setupInstructions')}
        </Text>
        
        {Platform.OS === 'ios' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {i18n.t('voiceCommands.iosInstructions')}
            </Text>
            {instructions.map((instruction, index) => (
              <Text key={index} style={[styles.instructionText, { color: colors.textSecondary }]}>
                {instruction}
              </Text>
            ))}
            <Text style={[styles.exampleText, { color: colors.primary }]}>
              {i18n.t('voiceCommands.quickAddExample')}
            </Text>
          </>
        )}
        
        {Platform.OS === 'android' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {i18n.t('voiceCommands.androidInstructions')}
            </Text>
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
              Feature coming soon for Android devices with Google Assistant integration.
            </Text>
          </>
        )}
      </View>
    );
  };

  if (!settings) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {i18n.t('voiceCommands.title')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.primary }]}>
              {i18n.t('voiceCommands.cancel')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {i18n.t('voiceCommands.description')}
          </Text>

          {/* Enable/Disable Toggle */}
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: colors.surface }]}
            onPress={handleToggleEnabled}
          >
            <Text style={[styles.toggleText, { color: colors.textPrimary }]}>
              {i18n.t('voiceCommands.enabled')}
            </Text>
            <View
              style={[
                styles.toggle,
                { backgroundColor: settings.enabled ? colors.success : colors.border },
              ]}
            >
              <View
                style={[
                  styles.toggleIndicator,
                  {
                    backgroundColor: colors.background,
                    transform: [{ translateX: settings.enabled ? 20 : 0 }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Siri Support Info */}
          {Platform.OS === 'ios' && isSiriShortcutsAvailable() && (
            <TouchableOpacity
              style={[styles.infoButton, { backgroundColor: colors.surface }]}
              onPress={handleShowInstructions}
            >
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                ℹ️ {i18n.t('voiceCommands.setupInstructions')}
              </Text>
            </TouchableOpacity>
          )}

          {showInstructions && renderInstructions()}

          {/* Custom Phrases Section */}
          <View style={styles.phrasesSection}>
            <View style={styles.phrasesSectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {i18n.t('voiceCommands.customPhrases')}
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddPhrase}
              >
                <Text style={[styles.addButtonText, { color: colors.buttonText }]}>
                  + {i18n.t('voiceCommands.addPhrase')}
                </Text>
              </TouchableOpacity>
            </View>

            {settings.customPhrases.length === 0 ? (
              <Text style={[styles.noPhrases, { color: colors.textSecondary }]}>
                {i18n.t('voiceCommands.noPhrases')}
              </Text>
            ) : (
              settings.customPhrases.map((phrase) => (
                <View
                  key={phrase.id}
                  style={[styles.phraseItem, { backgroundColor: colors.surface }]}
                >
                  <View style={styles.phraseInfo}>
                    <Text style={[styles.phraseText, { color: colors.textPrimary }]}>
                      "{phrase.phrase}"
                    </Text>
                    <Text style={[styles.phraseDetails, { color: colors.textSecondary }]}>
                      {phrase.amount}€ • {phrase.description}
                      {phrase.category && ` • ${phrase.category}`}
                    </Text>
                  </View>
                  <View style={styles.phraseActions}>
                    <TouchableOpacity
                      onPress={() => handleEditPhrase(phrase)}
                      style={styles.actionButton}
                    >
                      <Text style={{ color: colors.primary }}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePhrase(phrase)}
                      style={styles.actionButton}
                    >
                      <Text style={{ color: colors.error }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Add/Edit Phrase Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingPhrase ? i18n.t('voiceCommands.editPhrase') : i18n.t('voiceCommands.addPhrase')}
              </Text>

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={i18n.t('voiceCommands.phraseExample')}
                placeholderTextColor={colors.textSecondary}
                value={phraseText}
                onChangeText={setPhraseText}
              />

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={i18n.t('voiceCommands.amountLabel')}
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={i18n.t('voiceCommands.descriptionLabel')}
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
              />

              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={i18n.t('voiceCommands.categoryLabel')}
                placeholderTextColor={colors.textSecondary}
                value={category}
                onChangeText={setCategory}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.border }]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.textPrimary }]}>
                    {i18n.t('voiceCommands.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={handleSavePhrase}
                >
                  <Text style={[styles.modalButtonText, { color: colors.buttonText }]}>
                    {i18n.t('voiceCommands.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  infoButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
  },
  instructionsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
  },
  phrasesSection: {
    marginTop: 16,
  },
  phrasesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noPhrases: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  phraseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  phraseInfo: {
    flex: 1,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phraseDetails: {
    fontSize: 14,
  },
  phraseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
