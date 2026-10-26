// Página temporal para secciones que aún no hemos construido.
export default function ComingSoon({ title }) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <p className="text-slate-500">Esta sección está en construcción.</p>
    </div>
  )
}
