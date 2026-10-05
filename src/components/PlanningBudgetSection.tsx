import React, { useState } from 'react';
import { Calendar, CreditCard, PlusCircle, CheckCircle, Shield, FileCheck, Layers } from 'lucide-react';
import { PROPOSAL_DATA } from '../data/proposalData';
import { sound } from '../utils/audio';

export const PlanningBudgetSection: React.FC = () => {
  const [includeDigitalPack, setIncludeDigitalPack] = useState<boolean>(false);
  const budget = PROPOSAL_DATA.financialBudget;
  const planning = PROPOSAL_DATA.planning;
  const digitalOption = PROPOSAL_DATA.digitalPackOption;
  const paymentTerms = PROPOSAL_DATA.paymentTerms;

  const totalCalculated = PROPOSAL_DATA.totalBaseHT + (includeDigitalPack ? digitalOption.priceFCFA : 0);
  const totalFormatted = new Intl.NumberFormat('fr-FR').format(totalCalculated) + " FCFA HT";

  return (
    <section id="budget" className="relative py-28 bg-[#090a0d] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-[#ff3b1d] uppercase mb-2">
              10 / CADRE CONTRACTUEL
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              PLANNING &amp; PROPOSITION FINANCIÈRE
            </h2>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs text-neutral-400 block tracking-wider">
              CLIENT : KOFFI &amp; DIABATÉ
            </span>
            <span className="font-mono text-xs text-[#ff3b1d] block font-semibold">
              OFFRE OFFICIELLE AFRIKAFUN
            </span>
          </div>
        </div>

        {/* 1. Planning Prévisionnel (6 à 8 semaines) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-[#ff3b1d] uppercase tracking-wider font-bold">
                11 / CALENDRIER D'EXÉCUTION
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase mt-1">
                DURÉE GLOBALE : 6 À 8 SEMAINES
              </h3>
            </div>
            <div className="text-xs font-mono text-neutral-400 hidden sm:block">
              Arrêté après réception complète des fichiers Revit et DWG
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planning.map((plan) => (
              <div
                key={plan.week}
                className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[#ff3b1d] font-bold">
                      {plan.week}
                    </span>
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-white mb-2">
                    {plan.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {plan.deliverables.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-neutral-300"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Proposition Financière Table (exact 8 500 000 FCFA HT) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-[#ff3b1d] uppercase tracking-wider font-bold">
                12 / DÉCOMPOSITION FINANCIÈRE DÉTAILLÉE
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase mt-1">
                PRESTATIONS DE PRODUCTION CINÉMATOGRAPHIQUE
              </h3>
            </div>
            <div className="font-mono text-xs text-neutral-400">
              Devise : Franc CFA (XOF)
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0e1017] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/4 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Prestation</th>
                    <th className="py-4 px-6">Phase de réalisation</th>
                    <th className="py-4 px-6 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {budget.map((item) => (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors">
                      <td className="py-3.5 px-6 font-sans text-sm text-white font-medium">
                        {item.prestation}
                      </td>
                      <td className="py-3.5 px-6 text-neutral-400 uppercase">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-6 text-right text-neutral-200 tabular-nums font-semibold">
                        {item.montantFormatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Base Row */}
            <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-neutral-400 uppercase">
                  SOUS-TOTAL FILM PRINCIPAL (2'30 — 3'00 UHD/4K)
                </span>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Comprend l'ensemble des 10 postes de production ci-dessus
                </div>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-2xl sm:text-3xl text-white tabular-nums">
                  {PROPOSAL_DATA.totalBaseHTFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Option Digital Pack Interactive Add-on */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#121520] border border-[#ff3b1d]/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#ff3b1d]/20 border border-[#ff3b1d]/40 text-[#ff3b1d] font-mono text-[11px] font-bold uppercase">
                  10 / OPTION RECOMMANDÉE
                </span>
                <span className="font-mono text-xs text-neutral-400">RÉSEAUX SOCIAUX &amp; VIRALITÉ</span>
              </div>
              <h4 className="font-display font-black text-xl sm:text-2xl text-white uppercase mb-2">
                {digitalOption.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                {digitalOption.description}
              </p>
              <ul className="text-xs font-mono text-neutral-300 space-y-1.5">
                {digitalOption.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#ff3b1d] shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="font-display font-black text-2xl text-white tabular-nums">
                {digitalOption.priceFormatted}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIncludeDigitalPack(!includeDigitalPack);
                  sound.playUiClick();
                }}
                className={`px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
                  includeDigitalPack
                    ? 'bg-[#ff3b1d] text-white shadow-lg shadow-[#ff3b1d]/30'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                <span>{includeDigitalPack ? "✓ PACK DIGITAL INCLUS" : "+ AJOUTER LE PACK DIGITAL"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Total Grand Summary & Modalités de règlement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-white/10">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono text-[#ff3b1d] uppercase font-bold tracking-wider">
              13 / MODALITÉS DE RÈGLEMENT
            </span>
            <div className="space-y-2 font-mono text-xs text-neutral-300">
              {paymentTerms.map((term, idx) => (
                <div key={`${term.percent}-${idx}`} className="flex items-center gap-3 p-2.5 rounded bg-white/3 border border-white/5">
                  <span className="px-2 py-0.5 rounded bg-[#ff3b1d]/20 text-[#ff3b1d] font-bold">
                    {term.percent}%
                  </span>
                  <span>{term.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-black border border-white/15 text-right shadow-2xl">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
              TOTAL ESTIMÉ DE LA PROPOSITION
            </span>
            <div className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight tabular-nums">
              {totalFormatted}
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-2">
              Validité de la proposition : 60 jours · AFRIKAFUN Production
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
