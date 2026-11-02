import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Clock, Send, Sparkles, HelpCircle } from 'lucide-react';

export default function ContactPage({ settings, onShowToast }) {
  const wa = settings?.whatsapp || '213555000000';
  const ig = settings?.instagram || 'touta.delices';
  const phone = settings?.phone || '0555000000';

  const [name, setName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [subject, setSubject] = useState('طلب استفسار خاص');
  const [message, setMessage] = useState('');

  function handleSendWhatsApp(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      if (onShowToast) onShowToast('يرجى كتابة الاسم والرسالة');
      return;
    }

    const text = `مرحبًا Touta Délices 🍰✨%0A%0A*الاسم:* ${encodeURIComponent(name)}%0A*الهاتف:* ${encodeURIComponent(customerPhone || 'غير محدد')}%0A*الموضوع:* ${encodeURIComponent(subject)}%0A%0A*الرسالة:*%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
    if (onShowToast) onShowToast('جاري فتح محادثة WhatsApp...');
  }

  return (
    <div style={{ padding: '36px 0 70px' }}>
      {/* Header */}
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
          <Sparkles size={14} color="#7B2CBF" /> نسعد دائماً بتواصلكم ومشاركتكم أفراحكم 💌
        </span>
        <h1 style={{
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          color: 'var(--purple-deep)',
          fontWeight: 800,
          letterSpacing: '-0.5px'
        }}>
          تواصلوا مع Touta Délices
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16.5px', maxWidth: '600px', margin: '10px auto 0', lineHeight: 1.7 }}>
          فريقنا في خدمتكم لأي استفسار، طلبات خاصة، أو تفاصيل حلويات مناسباتكم السعيدة
        </p>
      </div>

      {/* Main Grid: Direct Contact Cards + Form */}
      <section className="wrap" style={{ marginBottom: '56px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Right Column: Contact Methods & Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card contact-card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1.5px solid rgba(37, 211, 102, 0.25)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '18px',
                backgroundColor: 'rgba(37, 211, 102, 0.12)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageCircle size={30} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#25D366' }}>أسرع وسيلة للرد ⚡</span>
                <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, margin: '2px 0' }}>واتساب للطلبات المباشرة</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right', fontWeight: 600 }}>
                  +{wa}
                </span>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card contact-card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1.5px solid rgba(247, 197, 213, 0.6)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(247, 197, 213, 0.4), rgba(199, 125, 255, 0.3))',
                color: '#7B2CBF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--purple-royal)' }}>صور وفيديوهات حصرية 📸</span>
                <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, margin: '2px 0' }}>حساب Instagram</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right', fontWeight: 600 }}>
                  @{ig}
                </span>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${phone}`}
              className="card contact-card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1.5px solid rgba(199, 125, 255, 0.3)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.12), rgba(199, 125, 255, 0.2))',
                color: '#7B2CBF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--purple-royal)' }}>الاتصال المباشر ☎️</span>
                <h3 style={{ fontSize: '18px', color: 'var(--purple-deep)', fontWeight: 800, margin: '2px 0' }}>خدمة الزبائن</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right', fontWeight: 600 }}>
                  {phone}
                </span>
              </div>
            </a>

            {/* Working Hours Info Box */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7FD 100%)',
              borderRadius: '24px',
              padding: '26px',
              border: '1px solid rgba(199, 125, 255, 0.25)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '16px', color: 'var(--purple-deep)', marginBottom: '12px' }}>
                <Clock size={19} color="#7B2CBF" />
                <span>أوقات العمل والتوصيل</span>
              </div>
              <p style={{ fontSize: '14px', color: '#5C4A68', lineHeight: 1.8 }}>
                • نستقبل طلباتكم واستفساراتكم يومياً من <b>10:00 صباحاً</b> حتى <b>20:00 مساءً</b>.
              </p>
              <p style={{ fontSize: '14px', color: '#5C4A68', lineHeight: 1.8, marginTop: '8px' }}>
                • خدمة التوصيل متوفرة لجميع ولايات الوطن في بوكسات مبردة ومخصصة للحلويات.
              </p>
            </div>
          </div>

          {/* Left Column: Direct Message Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '38px 32px',
            border: '1px solid rgba(199, 125, 255, 0.25)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '22px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '8px' }}>
              أرسلي لنا طلبك أو استفسارك مباشرة 💌
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              اكتبي تفاصيل رغبتك وسيقوم فريق Touta Délices بالتواصل معك فوراً عبر WhatsApp
            </p>

            <form onSubmit={handleSendWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px' }}>
                  الاسم الكريم: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: منال بلقاسم"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(199, 125, 255, 0.3)',
                    background: '#FAF7FD',
                    fontSize: '14.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px' }}>
                  رقم الهاتف (اختياري):
                </label>
                <input
                  type="tel"
                  placeholder="0555000000"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(199, 125, 255, 0.3)',
                    background: '#FAF7FD',
                    fontSize: '14.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px' }}>
                  نوع الاستفسار أو المناسبة:
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(199, 125, 255, 0.3)',
                    background: '#FAF7FD',
                    fontSize: '14.5px',
                    outline: 'none',
                    color: 'var(--purple-deep)',
                    fontWeight: 600
                  }}
                >
                  <option value="طلب استفسار خاص">طلب استفسار خاص</option>
                  <option value="طلب كيكة مناسبة مخصصة">طلب كيكة مناسبة مخصصة (عيد ميلاد/تخرج)</option>
                  <option value="بوكس براونيز مع رسالة إهداء">بوكس براونيز مخصص مع رسالة إهداء 🎁</option>
                  <option value="استفسار عن التوصيل والولايات">استفسار عن التوصيل والولايات</option>
                  <option value="طلب بالجملة أو حفلات">طلبات الفعاليات، الحفلات والخطوبات</option>
                  <option value="أمر آخر">موضوع آخر</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--purple-deep)', marginBottom: '7px' }}>
                  رسالتك أو تفاصيل طلبك: *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="اكتبي هنا النكهات المفضلة، التاريخ المطلوب للاستلام، أو أي كتابة تريدين وضعها على الكيكة..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid rgba(199, 125, 255, 0.3)',
                    background: '#FAF7FD',
                    fontSize: '14.5px',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #25D366 0%, #1EAA52 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '15.5px',
                  fontWeight: 800,
                  boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageCircle size={19} />
                <span>إرسال عبر WhatsApp 💬</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '25px', color: 'var(--purple-deep)', fontWeight: 800 }}>الأسئلة الشائعة ❓</h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>إجابات سريعة على تساؤلات زبائننا الكرام</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '980px',
          margin: '0 auto'
        }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '22px', border: '1px solid rgba(199, 125, 255, 0.22)' }}>
            <h4 style={{ fontSize: '16.5px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>كم يستغرق التوصيل؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.75 }}>
              نحضر الحلويات طازجة في نفس اليوم. التوصيل السريع يتم في غضون ساعات أو في التوقيت واليوم المحدد الذي تختارونه عند إتمام الطلب.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '22px', border: '1px solid rgba(199, 125, 255, 0.22)' }}>
            <h4 style={{ fontSize: '16.5px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>كيف يتم الدفع؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.75 }}>
              نوفر خدمة الدفع نقداً عند الاستلام (Cash on Delivery) بعد استلام الطلبية والتأكد من فخامتها ونضارتها.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '22px', border: '1px solid rgba(199, 125, 255, 0.22)' }}>
            <h4 style={{ fontSize: '16.5px', color: 'var(--purple-deep)', fontWeight: 800, marginBottom: '9px' }}>هل تتوفر كيكات مخصصة بالأسماء؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.75 }}>
              نعم بكل تأكيد! يمكنك إضافة أي اسم، جملة تهنئة، أو تصميم خاص عبر المحادثة المباشرة وسنصممها لك بكل حب.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .contact-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(123, 44, 191, 0.15) !important;
          border-color: var(--purple-royal) !important;
        }
      `}</style>
    </div>
  );
}
