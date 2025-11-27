import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function LargeContentLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F3FA] py-12 px-6 text-gray-800">
      {/* Logos opcionales arriba (puedes quitarlos si no los necesitas) */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <ApplicationLogo className="w-16 h-16 fill-current text-[#441B69]" />
        </Link>
        <ApplicationLogo className="w-16 h-16 fill-current text-[#441B69]" />
      </div>

      {/* Contenedor amplio para contenido grande */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
}
