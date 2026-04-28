import SignupForm from './signup-form'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ claim?: string }>
}) {
  const { claim } = await searchParams
  return <SignupForm claim={claim} />
}
