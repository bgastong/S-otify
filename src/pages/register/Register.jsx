import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await register(name, email, password);
      setSuccess(t("auth.registerSuccess", "Usuario registrado correctamente."));

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (err) {
      setError(err.message || "No pudimos crear la cuenta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1db954]">
            {t("auth.createAccount")}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            SÑOTIFY
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {t("auth.registerSubtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              {t("auth.name")}
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              {t("auth.email")}
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tucorreo@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              {t("auth.password")}
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#1db954] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#1ed760] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t("common.loading") : t("auth.register")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {t("auth.hasAccount", "¿Ya tenés cuenta?")}{" "}
          <Link to="/login" className="font-bold text-white hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}