// utils/onboardingStep.js
export const onboardingStep = (kin) => {
  if (kin.status === true) return 'done'

  const hasName = !!kin.name?.trim()
  const hasRole = !!kin.role?.trim()
  const hasDOB = !!kin.dob
  const hasGender = !!kin.gender?.trim()
  const hasPin = !!kin.pin?.trim()

  if (!hasName || !hasRole) return 'name-role'
  if (!hasDOB || !hasGender) return 'dob-gender'
  if (!hasPin) return 'pin'

  return 'done'
}
