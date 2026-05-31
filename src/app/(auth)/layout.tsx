export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
      {children}
    </div>
  )
}
