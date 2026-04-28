import { strings } from '@/lib/i18n'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-12">{strings.about.title}</h1>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{strings.about.missionHeading}</h2>
        <p className="text-gray-600 leading-relaxed">{strings.about.missionText}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{strings.about.whyHeading}</h2>
        <p className="text-gray-600 leading-relaxed">{strings.about.whyText}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{strings.about.howHeading}</h2>
        <ol className="space-y-3">
          {strings.about.howSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-300 tabular-nums shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">{strings.about.builtByHeading}</h2>
        <p className="text-gray-600 leading-relaxed">
          {strings.about.builtByText}{' '}
          <a
            href="https://github.com/kayceecones/dpc-routing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {strings.about.githubLink}
          </a>
          .
        </p>
      </section>
    </div>
  )
}
