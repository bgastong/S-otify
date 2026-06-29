import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password);
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center ]">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-300">
              {t("auth.name")}
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#1db954] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#1ed760]"
          >
            {t("auth.register")}
          </button>
        </form>
      </div>
    </div>
  );
}