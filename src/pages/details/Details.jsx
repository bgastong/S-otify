import { useTranslation } from "react-i18next";

function Details() {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-linear-to-b from-zinc-800/60 to-black p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">{t('details.eyebrow')}</p>
      <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">{t('details.title')}</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-300">{t('details.description')}</p>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/65 p-4">
        <p className="text-sm font-semibold text-zinc-200">{t('details.integrationPending')}</p>
        <p className="mt-2 text-xs text-zinc-400">{t('details.integrationNote')}</p>
      </div>
    </section>
  );
}

export default Details;