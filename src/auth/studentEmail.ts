const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.de",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.de",
  "gmx.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
]);

export function getEmailDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return null;
  return trimmed.slice(at + 1);
}

export function isStudentEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return !PUBLIC_EMAIL_DOMAINS.has(domain);
}

export function studentEmailError(email: string): string | null {
  const domain = getEmailDomain(email);
  if (!domain) return "Enter a valid email address.";

  if (!isStudentEmail(email)) {
    return "Please use your student email. Public email providers (like Gmail/Yahoo/Outlook) are not allowed.";
  }

  return null;
}
