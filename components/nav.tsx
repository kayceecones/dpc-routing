import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/i18n";

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-blue-600 text-lg">
          {strings.nav.logo}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            {strings.about.navLink}
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                {strings.nav.dashboard}
              </Link>
              <form action="/auth/signout" method="post">
                <button className="text-gray-600 hover:text-gray-900">{strings.nav.signOut}</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                {strings.nav.login}
              </Link>
              <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                {strings.nav.signUp}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
