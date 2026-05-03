function Details() {
    return (
        <section className="rounded-2xl border border-zinc-800/80 bg-linear-to-b from-zinc-800/60 to-black p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">Detalle</p>
            <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Vista de cancion</h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-300">
                Esta pantalla queda lista para la integracion de Fabrizio: fetch por id, manejo de error y render final de datos.
            </p>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/65 p-4">
                <p className="text-sm font-semibold text-zinc-200">Integracion pendiente</p>
                <p className="mt-2 text-xs text-zinc-400">
                    No implementar logica final en esta rama para evitar conflictos con tareas asignadas.
                </p>
            </div>
        </section>
    );
}

export default Details;