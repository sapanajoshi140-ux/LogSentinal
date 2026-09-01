import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

def verify_email_html(name: str, link: str) -> str:
    return f"""
    <html>
      <body style="font-family:Arial">
        <p>Hello {name},</p>
        <p>Click below to verify your email:</p>
        <a href="{link}"
           style="padding:10px 16px;
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  border-radius:5px;">
           Verify Email
        </a>
        <p style="font-size:12px;color:#777;">
          This is an automated email. Please do not reply.
        </p>
      </body>
    </html>
    """

def reset_email_html(name: str, link: str) -> str:
    return f"""
    <html>
      <body style="font-family:Arial">
        <p>Hello {name},</p>
        <p>Click below to reset your password:</p>
        <a href="{link}"
           style="padding:10px 16px;
                  background:#dc2626;
                  color:white;
                  text-decoration:none;
                  border-radius:5px;">
           Reset Password
        </a>
        <p style="font-size:12px;color:#777;">
          This is an automated email. Please do not reply.
        </p>
      </body>
    </html>
    """

async def send_email(to: str, subject: str, html: str):
    message = MessageSchema(
        subject=subject,
        recipients=[to],
        body=html,
        subtype="html",
        headers={"Reply-To": "no-reply@localhost"}
    )

    fm = FastMail(conf)
    await fm.send_message(message)