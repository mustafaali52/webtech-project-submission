import { featuresData } from '../../utils/data';
import { useScrollAnimation } from '../../hooks/landing-page-hooks/useScrollAnimation';

export default function FeaturesSection() {
  const { isVisible } = useScrollAnimation();

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SWEEP?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform revolutionizes how students gain experience and how companies find talented individuals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              id={`feature-${index}`}
              data-animate
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                isVisible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}