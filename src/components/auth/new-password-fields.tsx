/** Shared step-2 fields: optional full name, new password and confirmation. */
export function NewPasswordFields({ defaultName }: { defaultName?: string }) {
  return (
    <>
      {defaultName !== undefined && (
        <label>
          <span>Full name</span>
          <input name="name" defaultValue={defaultName} required autoComplete="name" />
        </label>
      )}
      <label>
        <span>New password</span>
        <input name="newPassword" type="password" required minLength={10} autoComplete="new-password" placeholder="At least 10 characters, with a number" autoFocus />
      </label>
      <label>
        <span>Confirm new password</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" />
      </label>
    </>
  );
}
