// Envuelve un campo de formulario con su etiqueta y su mensaje de error.
export default function Field({ label, error, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-600">{error}</span>}
    </label>
  )
}
