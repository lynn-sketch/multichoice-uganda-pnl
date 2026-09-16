import { EmptyState, PageHeader } from '../components/EmptyState';
import { useScenario } from '../context/ScenarioContext';
import { generateForecast } from '../services/forecastService';
import { MIN_PERIODS_FOR_FORECAST } from '../theme/tokens';

export function ForecastingPage() {
  const { result } = useScenario();

  // Only current period exists — pass single actual point to demonstrate unavailable state.
  const revenueForecast = generateForecast([
    { period: 'August 2026', value: result.baseRevenue },
  ]);
  const profitForecast = generateForecast([
    { period: 'August 2026', value: result.profitAfterIncentive },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forecasting"
        subtitle="Forecast service is wired for future multi-period models. No fabricated forecasts are shown."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-[#12263f]">Service contract</h4>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          The Forecasting page consumes <code className="rounded bg-slate-100 px-1">forecastService.generateForecast</code>.
          When at least {MIN_PERIODS_FOR_FORECAST} historical periods exist, the UI will render Actual, Forecast and
          Confidence interval series. The implementation can later be swapped for Python / scikit-learn / statsmodels
          without redesigning this page.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">Observed Data</span>
          <span className="rounded-md bg-cyan-50 px-2 py-1 text-cyan-700">Forecast</span>
          <span className="rounded-md bg-violet-50 px-2 py-1 text-violet-700">Confidence Interval</span>
        </div>
      </div>

      <ForecastBlock
        title="Revenue Forecast"
        result={revenueForecast}
      />
      <ForecastBlock
        title="Profit Forecast"
        result={profitForecast}
      />
      <ForecastBlock
        title="Hardware Unit Forecast"
        result={generateForecast([{ period: 'August 2026', value: result.totalHardwareUnits }])}
      />
      <ForecastBlock
        title="Subscription Revenue Forecast"
        result={generateForecast([{ period: 'August 2026', value: result.subscriptionRevenue }])}
      />
    </div>
  );
}

function ForecastBlock({
  title,
  result,
}: {
  title: string;
  result: ReturnType<typeof generateForecast>;
}) {
  if (!result.available) {
    return (
      <EmptyState
        icon="chart"
        title={title}
        description={
          result.reason ??
          'More historical periods are required before a meaningful forecast can be generated.'
        }
      />
    );
  }
  return null;
}
