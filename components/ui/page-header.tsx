import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              marginTop: 6,
              color: '#666',
              fontSize: 14,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {action}
        </div>
      )}
    </div>
  );
}