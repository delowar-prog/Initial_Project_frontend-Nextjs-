import React from 'react'

const Footer = () => {
    return (
        <footer className="mt-8 border-t border-slate-200/70 bg-white/60 backdrop-blur">
            <div className="mx-auto flex max-w-full items-center justify-between px-3 py-4 sm:px-6">
                <p className="text-sm text-slate-500">© {new Date().getFullYear()} App Seba — University Suite</p>
                <div className="flex items-center gap-4 text-sm">
                    <a className="text-slate-500 hover:text-slate-900" href="#">
                        Privacy
                    </a>
                    <a className="text-slate-500 hover:text-slate-900" href="#">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer