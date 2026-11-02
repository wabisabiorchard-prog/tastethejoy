import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Award, ShieldCheck, Clock, Users, ArrowLeft } from 'lucide-react';

export default function AboutPage({ settings }) {
  return (
    <div style={{ padding: '36px 0 70px' }}>
      {/* Page Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '46px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--purple-deep)',
          backgroundColor: 'rgba(199, 125, 255, 0.18)',
          border: '1px solid rgba(199, 125, 255, 0.35)',
          padding: '6px 20px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} color="#7B2CBF" /> تعرفي على حكاية شغفنا 🍰
        </span>
        <h1 style={{
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          color: 'var(--purple-deep)',
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}>
          عن متجر Touta Délices
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16.5px', maxWidth: '640px', margin: '12px auto 0', lineHeight: 1.8 }}>
          حيث يلتقي الشغف بصناعة أرقى الحلويات مع لمسات من البهجة والأناقة لتخليد أجمل اللحظات
        </p>
      </div>

      {/* Main Story Section */}
      <section className="wrap" style={{ marginBottom: '56px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          padding: '44px 34px',
          border: '1px solid rgba(199, 125, 255, 0.22)',
          boxShadow: 'var(--shadow)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          alignItems: 'center',
          gap: '44px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--purple-royal)',
              fontWeight: 800,
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              <Sparkles size={16} />
              <span>البداية والرحلة الحلوة</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              color: 'var(--purple-deep)',
              fontWeight: 800,
              marginBottom: '18px',
              lineHeight: 1.35
            }}>
              كل قطعة حلوى تروي قصة حب وسعادة 🍰✨
            </h2>
            <p style={{ fontSize: '16px', color: '#4A3B53', lineHeight: 1.9, marginBottom: '16px' }}>
              {settings?.about_text || 'قصة Touta Délices بدأت من شغف أصيل بابتكار أرقى الحلويات العصرية، لنقدم لكم تشكيلة ساحرة من التشيز كيك البارد، كيكات المناسبات المميزة، وبوكسات البراونيز المقرمشة بأجود المكونات وبكل عناية، لتكون كل مناسبة معكم ذكرى استثنائية.'}
            </p>
            <p style={{ fontSize: '15px', color: '#6A5675', lineHeight: 1.8 }}>
              نؤمن في Touta Délices بأن الحلويات ليست مجرد طعم لذيذ، بل هي لحظة فرح واحتفال نشاركها مع من نحب في أعياد الميلاد، النجاح، واللقاءات الدافئة. لذلك نكرّس خبرتنا لاختيار أجود أنواع الشوكولاتة والجبن والفواكه لخلق تجربة تذوق تلامس القلوب.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '26px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '4 / 3',
              border: '2px solid rgba(247, 197, 213, 0.4)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop"
                alt="حلويات Touta Délices الفاخرة"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-14px',
              right: '20px',
              background: 'linear-gradient(135deg, #7B2CBF, #431259)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '18px',
              fontSize: '13.5px',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(123, 44, 191, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={15} color="#F7C5D5" /> جودة لا تضاهى
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="wrap" style={{ marginBottom: '56px' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <h2 style={{ fontSize: '26px', color: 'var(--purple-deep)', fontWeight: 800 }}>
            ركائز التميز في Touta Délices 💎
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15.5px', marginTop: '8px' }}>
            التزامنا الثابت بالجودة والبهجة في كل طلب
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '22px'
        }}>
          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '30px 26px',
            border: '1px solid rgba(199, 125, 255, 0.22)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.15), rgba(199, 125, 255, 0.25))',
              color: '#7B2CBF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>
              مكونات أصلية وممتازة
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.75 }}>
              نختار بعناية أجود الشوكولاتة البلجيكية، وزبدة الفستق الطبيعية، وأشهى أنواع الأجبان الطازجة دون أي تنازل.
            </p>
          </div>

          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '30px 26px',
            border: '1px solid rgba(199, 125, 255, 0.22)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(247, 197, 213, 0.3), rgba(247, 197, 213, 0.5))',
              color: '#D81B60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>
              صُنعت بحب وشغف
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.75 }}>
              كل صنف يتم تحضيره وتزيينه يدوياً بعناية فائقة وتناغم في النكهات ليفوق كل التوقعات.
            </p>
          </div>

          <div className="card" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '30px 26px',
            border: '1px solid rgba(199, 125, 255, 0.22)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(86, 207, 178, 0.2), rgba(86, 207, 178, 0.35))',
              color: '#1B9A7B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>
              تغليف فاخر ومبرد
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.75 }}>
              تصلكم حلوياتكم في بوكسات أنيقة وعصرية مبردة تحافظ على قوامها وطزاجتها حتى باب بيتكم.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="wrap">
        <div style={{
          background: 'linear-gradient(135deg, #431259 0%, #7B2CBF 100%)',
          color: '#FFFFFF',
          borderRadius: '30px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 16px 40px rgba(123, 44, 191, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(247, 197, 213, 0.12)',
            pointerEvents: 'none'
          }} />

          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, marginBottom: '14px', position: 'relative' }}>
            جاهزة لتجربة طعم يسعد كل الحواس؟ 🍰💜
          </h2>
          <p style={{ color: '#F7C5D5', fontSize: '16.5px', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.7, position: 'relative' }}>
            اكتشفي تشكيلتنا الفاخرة من الحلويات والكيكات واطلبي الآن لتصلك طازجة أينما كنتِ.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link
              to="/products"
              className="btn"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#431259',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
              }}
            >
              <span>تصفح قائمة الحلويات</span>
              <ArrowLeft size={16} />
            </Link>
            <Link
              to="/contact"
              className="btn outline"
              style={{
                borderColor: '#F7C5D5',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255,255,255,0.08)',
                textDecoration: 'none'
              }}
            >
              <span>تواصل معنا للاستفسار</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
