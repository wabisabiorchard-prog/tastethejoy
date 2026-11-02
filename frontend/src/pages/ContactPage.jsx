import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Clock, Send, Sparkles, HelpCircle } from 'lucide-react';

export default function ContactPage({ settings, onShowToast }) {
  const wa = settings?.whatsapp || '213555000000';
  const ig = settings?.instagram || 'taste.the.joy';
  const phone = settings?.phone || '0555000000';

  const [name, setName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [subject, setSubject] = useState('طلب استفسار خاص');
  const [message, setMessage] = useState('');

  function handleSendWhatsApp(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      if (onShowToast) onShowToast('يرجى ملء الاسم والرسالة');
      return;
    }

    const text = `مرحبًا Taste the Joy 🤎%0A%0A*الاسم:* ${encodeURIComponent(name)}%0A*الهاتف:* ${encodeURIComponent(customerPhone || 'غير محدد')}%0A*الموضوع:* ${encodeURIComponent(subject)}%0A%0A*الرسالة:*%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
    if (onShowToast) onShowToast('جاري فتح محادثة WhatsApp...');
  }

  return (
    <div style={{ padding: '30px 0 60px' }}>
      {/* Header */}
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
          نسعد دائماً بتواصلكم 📞
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', color: 'var(--chocolate)' }}>
          تواصلوا معنا
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16.5px', maxWidth: '580px', margin: '8px auto 0' }}>
          فريقنا في خدمتكم لأي استفسار، طلبات خاصة، أو تفاصيل مناسباتكم السعيدة
        </p>
      </div>

      {/* Main Grid: Direct Contact Cards + Form */}
      <section className="wrap" style={{ marginBottom: '50px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Right Column: Contact Methods & Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--off-white)',
                borderRadius: '22px',
                padding: '24px',
                border: '1px solid var(--beige)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="contact-card-hover"
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#e8f8ed',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageCircle size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#25D366' }}>أسرع وسيلة للرد ⚡</span>
                <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', margin: '2px 0' }}>واتساب للطلبات المباشرة</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right' }}>
                  +{wa}
                </span>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--off-white)',
                borderRadius: '22px',
                padding: '24px',
                border: '1px solid var(--beige)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="contact-card-hover"
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--pink-light)',
                color: 'var(--chocolate)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>صور وفيديوهات يومية 📸</span>
                <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', margin: '2px 0' }}>حساب Instagram</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right' }}>
                  @{ig}
                </span>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${phone}`}
              style={{
                backgroundColor: 'var(--off-white)',
                borderRadius: '22px',
                padding: '24px',
                border: '1px solid var(--beige)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="contact-card-hover"
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(201, 165, 131, 0.2)',
                color: 'var(--chocolate)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>الاتصال الهاتفي ☎️</span>
                <h3 style={{ fontSize: '18px', color: 'var(--chocolate)', margin: '2px 0' }}>رقم خدمة الزبائن</h3>
                <span style={{ fontSize: '14px', color: 'var(--muted)', direction: 'ltr', display: 'block', textAlign: 'right' }}>
                  {phone}
                </span>
              </div>
            </a>

            {/* Working Hours Info Box */}
            <div style={{
              backgroundColor: 'linear-gradient(135deg, var(--off-white) 0%, #fff7ee 100%)',
              borderRadius: '22px',
              padding: '24px',
              border: '1px solid var(--beige)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '16px', color: 'var(--chocolate)', marginBottom: '12px' }}>
                <Clock size={18} />
                <span>أوقات العمل والتوصيل</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>
                • نستقبل طلباتكم واستفساراتكم يومياً من <b>10:00 صباحاً</b> حتى <b>20:00 مساءً</b>.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginTop: '6px' }}>
                • خدمة التوصيل متوفرة لجميع ولايات الوطن الـ 58 في علب خاصة مبردة.
              </p>
            </div>
          </div>

          {/* Left Column: Direct Message Form */}
          <div style={{
            backgroundColor: 'var(--off-white)',
            borderRadius: '26px',
            padding: '36px 30px',
            border: '1px solid var(--beige)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ fontSize: '22px', color: 'var(--chocolate)', marginBottom: '8px' }}>
              أرسل لنا استفسارك مباشرة 💌
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              اكتب بياناتك ورسالتك وسنقوم بالرد عليك في أسرع وقت عبر WhatsApp
            </p>

            <form onSubmit={handleSendWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  الاسم الكريم: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مريم بن سالم"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--beige)',
                    background: '#fff',
                    fontSize: '14.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  رقم الهاتف (اختياري):
                </label>
                <input
                  type="tel"
                  placeholder="0555000000"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--beige)',
                    background: '#fff',
                    fontSize: '14.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  نوع الاستفسار:
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--beige)',
                    background: '#fff',
                    fontSize: '14.5px'
                  }}
                >
                  <option value="طلب استفسار خاص">طلب استفسار خاص</option>
                  <option value="طلب كيكة مناسبة مخصصة">طلب كيكة مناسبة مخصصة (عيد ميلاد/تخرج)</option>
                  <option value="استفسار عن التوصيل والولايات">استفسار عن التوصيل والولايات</option>
                  <option value="طلب بالجملة أو حفلات">طلب بالجملة أو فعاليات وحفلات</option>
                  <option value="أمر آخر">موضوع آخر</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  رسالتك أو تفاصيل طلبك: *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="اكتب هنا أي تفاصيل أو نكهات أو تاريخ ترغب في استلام الطلب فيه..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--beige)',
                    background: '#fff',
                    fontSize: '14.5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  border: 'none',
                  fontSize: '15px'
                }}
              >
                <MessageCircle size={18} />
                <span>إرسال عبر WhatsApp 💬</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px' }}>الأسئلة الشائعة ❓</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '4px' }}>إجابات سريعة على أبرز التساؤلات</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{ backgroundColor: 'var(--off-white)', padding: '20px 22px', borderRadius: '18px', border: '1px solid var(--beige)' }}>
            <h4 style={{ fontSize: '16px', color: 'var(--chocolate)', marginBottom: '8px' }}>كم يستغرق التوصيل؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
              نجهز الحلويات طازجة في نفس اليوم. التوصيل المحلي يتم في غضون ساعات قليلة أو في الوقت المحدد الذي تختاره عند الطلب.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--off-white)', padding: '20px 22px', borderRadius: '18px', border: '1px solid var(--beige)' }}>
            <h4 style={{ fontSize: '16px', color: 'var(--chocolate)', marginBottom: '8px' }}>ما هي طرق الدفع؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
              نوفر الدفع نقداً عند الاستلام (Cash on Delivery) بعد أن تتسلم طلبيتك وتتأكد من سلامتها ونضارتها.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--off-white)', padding: '20px 22px', borderRadius: '18px', border: '1px solid var(--beige)' }}>
            <h4 style={{ fontSize: '16px', color: 'var(--chocolate)', marginBottom: '8px' }}>هل يمكن تخصيص كيكة لمناسبة؟</h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
              نعم بكل سرور! يمكنك طلب أي اسم أو عبارة أو ألوان مفضلة لكيكات أعياد الميلاد والمناسبات الخاصة عبر الواتساب.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .contact-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
          border-color: var(--pastel-brown);
        }
      `}</style>
    </div>
  );
}
