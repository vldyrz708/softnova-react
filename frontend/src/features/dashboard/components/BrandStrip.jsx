import './BrandStrip.css'

const BRANDS = [
  'blackpink.png',
  'bts.png',
  'twice.png',
  'allday.png',
  'enhypen.png',
  'lesserafim.png',
]

const BrandStrip = () => (
  <div className="brand-strip">
    <div className="brand-strip__inner">
      {BRANDS.map((logo) => (
        <img
          key={logo}
          src={`/legacy/images/${logo}`}
          alt={logo.replace('.png', '')}
          loading="lazy"
        />
      ))}
    </div>
    <p className="brand-strip__footer">© NOVA</p>
  </div>
)

export default BrandStrip
