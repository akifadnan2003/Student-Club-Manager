import { login } from './actions'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-ulu-bg p-4">
            <div className="w-full max-w-md bg-ulu-surface rounded-lg shadow-xl p-8 border-t-4 border-ulu-blue">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Uluforeigns</h1>
                    <p className="text-ulu-text-secondary text-sm font-medium uppercase tracking-wide">ISC Management Portal</p>
                </div>

                {searchParams.error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {searchParams.error}
                    </div>
                )}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ulu-text-secondary mb-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                            placeholder="member@uluforeigns.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ulu-text-secondary mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ulu-blue focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        formAction={login}
                        className="w-full bg-ulu-blue text-white font-bold py-3 rounded hover:bg-ulu-blue/90 transition duration-200 mt-4 h-11"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-ulu-text-secondary">
                    <p>Don&apos;t have an account?</p>
                    <p className="mt-1">Please contact the General Secretary for your credentials.</p>
                </div>
            </div>
        </div>
    )
}
