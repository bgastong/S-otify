function AsyncState({
  loading,
  error,
  isEmpty,
  loadingMessage = "Cargando...",
  emptyMessage = "No hay resultados.",
  onRetry,
}) {
  if (loading) {
    return (
      <p className="py-8 text-center text-sm font-medium text-zinc-400">
        {loadingMessage}
      </p>
    );
  }

  if (error) {
    return (
      <div className="my-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
        <p className="text-sm font-semibold text-red-200">{error}</p>

        {typeof onRetry === "function" && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-black text-black transition hover:scale-105"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p className="py-8 text-center text-sm font-medium text-zinc-500">
        {emptyMessage}
      </p>
    );
  }

  return null;
}

export default AsyncState;