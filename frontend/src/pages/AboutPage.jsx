import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Award, ShieldCheck, Clock, Users, ArrowLeft } from 'lucide-react';

export default function AboutPage({ settings }) {
  return (
    <div style={{ padding: '30px 0 60px' }}>
      {/* Page Header */}
      <div className="wrap" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--chocolate)',
          backgroundColor: 'var(--pink)',
          padding: '5px 18px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
          marginBottom: '10px'
        }}>
          تعرف على قصة شغفنا 🤎
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', color: 'var(--chocolate)' }}>
          عن متجر Taste the Joy
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16.5px', maxWidth: '620px', margin: '10px auto 0', lineHeight: 1.8 }}>
          حيث يلتقي الشغف بصناعة الحلويات مع أدق تفاصيل الفخامة والنكهة التي لا تُنسى
        </p>
      </div>

      {/* Main Story Section */}
      <section className="wrap" style={{ marginBottom: '50px' }}>
        <div style={{
          backgroundColor: 'var(--off-white)',
          borderRadius: '28px',
          padding: '40px 30px',
          border: '1px solid var(--beige)',
          boxShadow: 'var(--shadow)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          alignItems: 'center',
          gap: '40px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--pistachio-dark)', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
              <Sparkles size={16} />
              <span>البداية والحكاية</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', color: 'var(--chocolate)', marginBottom: '16px', lineHeight: 1.3 }}>
              كل قطعة حلوى وراءها قصة شغف لا تنتهي 🍰
            </h2>
            <p style={{ fontSize: '16px', color: '#634e3d', lineHeight: 1.9, marginBottom: '16px' }}>
              {settings?.about_text || 'قصة Taste the Joy تبدأ من شغف بسيط بالحلويات الراقية، لنقدم لكم تشكيلة متميزة من Cheesecake وكيكات وBrownies Box محضّرة بأجود المكونات وبكل حب، باش كل مناسبة عندكم تكون أحلى.'}
            </p>
            <p style={{ fontSize: '15px', color: '#7a6650', lineHeight: 1.8 }}>
              نؤمن في Taste the Joy بأن الحلويات ليست مجرد أطباق حلوة، بل هي مشاعر فرح واحتفال نتقاسمها مع من نحب في أعياد الميلاد، مناسبات النجاح، وحفلات العائلة والأصدقاء. لذلك نكرّس وقتنا لابتكار وصفات تجمع بين القوام المثالي والنكهة الساحرة.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '4 / 3'
            }}>
              <img
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop"
                alt="حلويات Taste the Joy الفاخرة"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-14px',
              right: '20px',
              backgroundColor: 'var(--chocolate)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: 'var(--shadow)'
            }}>
              ✨ جودة لا تقبل المساومة
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="wrap" style={{ marginBottom: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '26px' }}>ركائز تميزنا في Taste the Joy 💎</h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>ما يجعل كل تجربة تذوق معنا استثنائية</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--off-white)',
            borderRadius: '22px',
            padding: '28px 24px',
            border: '1px solid var(--beige)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'var(--pink)',
              color: 'var(--chocolate)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', marginBottom: '8px' }}>مكونات أصلية وممتازة</h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.7 }}>
              نختار بعناية فائقة الشوكولاتة البلجيكية، زبدة الفستق الإيطالية، والجبن الكريمي الطازج دون أي تنازل عن الجودة.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--off-white)',
            borderRadius: '22px',
            padding: '28px 24px',
            border: '1px solid var(--beige)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(155, 185, 140, 0.25)',
              color: 'var(--pistachio-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', marginBottom: '8px' }}>صُنعت بحب وعناية</h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.7 }}>
              كل طلب يتم تحضيره وتزيينه يدوياً بأيدي شغوفة تهتم بأدق تفاصيل التقديم والنكهة.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--off-white)',
            borderRadius: '22px',
            padding: '28px 24px',
            border: '1px solid var(--beige)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(201, 165, 131, 0.25)',
              color: 'var(--chocolate)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', marginBottom: '8px' }}>تغليف مبرد وفاخر</h3>
            <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: 1.7 }}>
              تصل حلوياتكم في علب أنيقة ومحمية مبردة تحافظ على نضارتها وطزاجتها حتى باب منزلكم.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="wrap">
        <div style={{
          background: 'var(--chocolate)',
          color: '#fff',
          borderRadius: '26px',
          padding: '40px 30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3.5vw, 32px)', marginBottom: '12px' }}>
            جاهز لتجربة طعم يسعد قلبك؟ 🤎
          </h2>
          <p style={{ color: 'var(--pink)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 24px' }}>
            اكتشف قائمتنا الكاملة من الحلويات والكيكات واطلب الآن لتصلك أينما كنت.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn" style={{ backgroundColor: '#fff', color: 'var(--chocolate)', textDecoration: 'none' }}>
              <span>تصفح قائمة الحلويات</span>
              <ArrowLeft size={16} />
            </Link>
            <Link to="/contact" className="btn outline" style={{ borderColor: 'var(--pink)', color: 'var(--pink)', textDecoration: 'none' }}>
              <span>تواصل معنا للاستفسار</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
