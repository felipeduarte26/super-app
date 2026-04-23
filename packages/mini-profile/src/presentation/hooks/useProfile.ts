import {useCallback, useEffect, useState} from 'react';
import {EventBus, AppEvents} from '@super-app/core';
import {
  type ProfileFailure,
  ProfileValidationFailure,
} from '../../domain/failures';
import type {UserUpdateInput} from '../../application/useCases/UpdateUserUseCase';
import type {UserViewModel} from '../../application/viewModels/UserViewModel';
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

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await container.getUserUseCase.execute();

    result.fold(
      err => setError(err),
      data => setUser(data),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  return {user, loading, saving, error, fieldErrors, refresh, updateUser};
}
