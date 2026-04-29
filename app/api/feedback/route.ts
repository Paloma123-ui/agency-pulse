import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const RECIPIENTS = [
  'palocella@garabato.com.py'
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { isAnonymous, name, department, topic, content, metadata } = body

    // 1. Store in Supabase
    const supabase = createServerClient()
    const { error: dbError } = await supabase
      .from('feedback')
      .insert([
        {
          is_anonymous: isAnonymous,
          name: isAnonymous ? 'Anónimo' : name,
          department,
          topic,
          content,
          metadata
        }
      ])

    if (dbError) throw dbError

    // 2. Send Emails via Resend
    const subject = `Nuevo Feedback: ${topic.toUpperCase()} - ${isAnonymous ? 'Anónimo' : name}`
    
    await resend.emails.send({
      from: 'Agency Pulse <onboarding@resend.dev>', // Adjust to verified domain in production
      to: RECIPIENTS,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Nuevo Feedback Recibido</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>De:</strong> ${isAnonymous ? 'Anónimo' : name}</p>
          <p><strong>Área:</strong> ${department}</p>
          <p><strong>Tema:</strong> ${topic.toUpperCase()}</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 16px; line-height: 1.6;">
            ${content.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Enviado desde Agency Pulse . Garabato Creative Agency</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Feedback Submission Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
