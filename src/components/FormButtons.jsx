// Botones "Cancelar" y "Guardar" que comparten todos los formularios.
export default function FormButtons({ saving, onCancel }) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">
        Cancelar
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </div>
  )
}
