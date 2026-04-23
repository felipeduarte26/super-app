import {useCallback, useEffect, useRef, useState} from 'react';
import {AppEvents, EventBus} from '@super-app/core';
import type {SettingsFailure} from '../../domain/failures';
import type {SettingsUpdateInput} from '../../application/useCases/UpdateSettingsUseCase';
import type {SettingsViewModel} from '../../application/viewModels/SettingsViewModel';
import {container} from '../../di';

export function useSettings() {
  const [settings, setSettings] = useState<SettingsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<SettingsFailure | null>(null);
  const settingsRef = useRef<SettingsViewModel | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await container.getSettingsUseCase.execute();

    result.fold(
      err => setError(err),
      data => {
        settingsRef.current = data;
        setSettings(data);
      },
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const emitIfThemeOrLanguageChanged = useCallback(
    (prev: SettingsViewModel | null, next: SettingsViewModel) => {
      if (!prev) {
        return;
      }
      if (next.theme !== prev.theme) {
        EventBus.emit(AppEvents.THEME_CHANGED, {mode: next.theme});
      }
      if (next.languageCode !== prev.languageCode) {
        EventBus.emit(AppEvents.SETTINGS_LANGUAGE_CHANGED, {
          language: next.languageCode,
        });
      }
    },
    [],
  );

  const updateSettings = useCallback(
    async (updates: SettingsUpdateInput) => {
      setUpdating(true);
      setError(null);

      const result = await container.updateSettingsUseCase.execute(updates);

      result.fold(
        err => setError(err),
        next => {
          const prev = settingsRef.current;
          settingsRef.current = next;
          setSettings(next);
          emitIfThemeOrLanguageChanged(prev, next);
        },
      );

      setUpdating(false);
    },
    [emitIfThemeOrLanguageChanged],
  );

  const resetToDefaults = useCallback(async () => {
    setUpdating(true);
    setError(null);

    const result = await container.updateSettingsUseCase.resetToDefaults();

    result.fold(
      err => setError(err),
      next => {
        const prev = settingsRef.current;
        settingsRef.current = next;
        setSettings(next);
        emitIfThemeOrLanguageChanged(prev, next);
      },
    );

    setUpdating(false);
  }, [emitIfThemeOrLanguageChanged]);

  return {
    settings,
    loading,
    updating,
    error,
    refresh,
    updateSettings,
    resetToDefaults,
  };
}
