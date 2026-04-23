import {useCallback, useEffect, useRef, useState} from 'react';
import {EventBus, AppEvents, useOn, useHandle} from '@super-app/core';
import {
  type ProfileFailure,
  ProfileValidationFailure,
} from '../../domain/failures';
import type {UserUpdateInput} from '../../application/useCases/UpdateUserUseCase';
import type {UserViewModel} from '../../application/viewModels/UserViewModel';
import {ProfileCustomEvents, type ProfileSummary} from '../../domain/events';
import {container} from '../../di';

export type ProfileFieldErrors = Partial<
  Record<'name' | 'email' | 'bio', string>
>;

export function useProfile() {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ProfileFailure | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [biometricActive, setBiometricActive] = useState(false);
  const userRef = useRef<UserViewModel | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await container.getUserUseCase.execute();

    result.fold(
      err => setError(err),
      data => {
        userRef.current = data;
        setUser(data);
      },
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ─── Evento Customizado (Fire & Forget) ──────────────────
  // Escuta 'settings:biometric_toggled' — evento que NÃO está no core.
  // O Settings emite, o Profile escuta usando apenas a string do evento.
  useOn<{enabled: boolean}>('settings:biometric_toggled', payload => {
    setBiometricActive(payload.enabled);
  });

  // ─── Request / Response ──────────────────────────────────
  // Registra handler para 'profile:get_summary'.
  // Qualquer mini-app pode fazer:
  //   const summary = await EventBus.request('profile:get_summary', {});
  useHandle<Record<string, never>, ProfileSummary | null>(
    ProfileCustomEvents.GET_SUMMARY,
    () => {
      const current = userRef.current;
      if (!current) {
        return null;
      }
      return {
        displayName: current.displayName,
        email: current.email,
        avatarInitials: current.avatarInitials,
      };
    },
  );

  const updateUser = useCallback(
    async (updates: UserUpdateInput) => {
      setSaving(true);
      setError(null);
      setFieldErrors({});

      const result = await container.updateUserUseCase.execute(updates);

      result.fold(
        err => {
          if (err instanceof ProfileValidationFailure) {
            setFieldErrors(err.fieldErrors as ProfileFieldErrors);
          } else {
            setError(err);
          }
        },
        updated => {
          userRef.current = updated;
          setUser(updated);
          EventBus.emit(AppEvents.PROFILE_UPDATED, {
            name: updated.displayName,
          });
        },
      );

      setSaving(false);
    },
    [],
  );

  return {
    user,
    loading,
    saving,
    error,
    fieldErrors,
    biometricActive,
    refresh,
    updateUser,
  };
}
