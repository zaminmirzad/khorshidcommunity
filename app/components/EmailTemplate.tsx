// app/components/EmailTemplate.tsx
interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const EmailTemplate = ({
  name,
  email,
  phone,
  subject,
  message,
}: EmailTemplateProps) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  }}>
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      borderRadius: '10px 10px 0 0',
    }}>
      <h2>KhorshidCommunity</h2>
      <p>New Contact Form Submission</p>
    </div>
    <div style={{
      background: '#f9fafb',
      padding: '30px',
      borderRadius: '0 0 10px 10px',
      border: '1px solid #e5e7eb',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#1e3a8a' }}>📝 Name:</strong>
        <div style={{
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '5px',
          border: '1px solid #e5e7eb',
        }}>{name}</div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#1e3a8a' }}>📧 Email:</strong>
        <div style={{
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '5px',
          border: '1px solid #e5e7eb',
        }}>{email}</div>
      </div>
      {phone && (
        <div style={{ marginBottom: '20px' }}>
          <strong style={{ color: '#1e3a8a' }}>📞 Phone:</strong>
          <div style={{
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '5px',
            border: '1px solid #e5e7eb',
          }}>{phone}</div>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#1e3a8a' }}>📌 Subject:</strong>
        <div style={{
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '5px',
          border: '1px solid #e5e7eb',
        }}>{subject}</div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#1e3a8a' }}>💬 Message:</strong>
        <div style={{
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '5px',
          border: '1px solid #e5e7eb',
          whiteSpace: 'pre-wrap',
        }}>{message}</div>
      </div>
    </div>
    <div style={{
      textAlign: 'center',
      padding: '20px',
      fontSize: '12px',
      color: '#6b7280',
    }}>
      <p>Sent from KhorshidCommunity Contact Form</p>
      <p>© 2025 KhorshidCommunity. All rights reserved.</p>
    </div>
  </div>
);