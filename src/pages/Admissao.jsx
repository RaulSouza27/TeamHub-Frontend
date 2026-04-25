import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Upload, CheckCircle, FileText, User, Briefcase, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'
import './Admissao.css'

const STEPS = ['Dados Pessoais', 'Dados Profissionais', 'Documentos', 'Revisão']

const initialForm = {
  nome: '', cpf: '', dataNasc: '', email: '', telefone: '', endereco: '',
  cargo: '', departamento: '', gestor: '', dataIngresso: '', regime: '',
  docs: [],
}

export default function Admissao() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [docs, setDocs] = useState([])

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1) }
  const prev = () => { if (step > 0) setStep(s => s - 1) }

  const handleDoc = (e) => {
    const files = Array.from(e.target.files)
    setDocs(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size/1024).toFixed(0)+'KB', ok: true }))])
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page">
        <Sidebar />
        <div className="main-content">
          <div className="page-body fade-in">
            <div className="admissao-success">
              <div className="success-icon"><CheckCircle size={56} /></div>
              <h2>Admissão enviada com sucesso!</h2>
              <p>Os dados de <strong>{form.nome || 'novo colaborador'}</strong> foram encaminhados para validação do RH.</p>
              <p className="success-sub">Você receberá uma notificação quando o processo for aprovado.</p>
              <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep(0); setForm(initialForm); setDocs([]) }}>
                Nova Admissão
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <div className="page-body fade-in">
          <div className="section-header">
            <div>
              <h1 className="section-title">Admissão Digital</h1>
              <p className="section-subtitle">Cadastre um novo colaborador em poucos passos</p>
            </div>
          </div>

          {/* Steps */}
          <div className="steps" style={{marginBottom:32}}>
            {STEPS.map((label, i) => (
              <div key={i} className="step-item" style={{flexDirection:'column', alignItems:'center', flex:1}}>
                <div style={{display:'flex', alignItems:'center', width:'100%'}}>
                  <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                    {i < step ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
                </div>
                <div className="step-label" style={{marginTop:6, textAlign:'center'}}>{label}</div>
              </div>
            ))}
          </div>

          <div className="admissao-form-card">
            {/* Step 0 – Dados Pessoais */}
            {step === 0 && (
              <div className="form-step fade-in">
                <div className="step-head">
                  <User size={20} style={{color:'var(--primary-light)'}} />
                  <h2>Dados Pessoais</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <div className="input-wrap"><User size={15} className="input-icon" />
                      <input className="form-input" placeholder="Nome completo" value={form.nome} onChange={set('nome')} /></div>
                  </div>
                  <div className="form-group">
                    <label>CPF *</label>
                    <div className="input-wrap"><FileText size={15} className="input-icon" />
                      <input className="form-input" placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} /></div>
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <div className="input-wrap"><FileText size={15} className="input-icon" />
                      <input className="form-input" type="date" value={form.dataNasc} onChange={set('dataNasc')} /></div>
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-wrap"><Mail size={15} className="input-icon" />
                      <input className="form-input" type="email" placeholder="email@empresa.com" value={form.email} onChange={set('email')} /></div>
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <div className="input-wrap"><Phone size={15} className="input-icon" />
                      <input className="form-input" placeholder="(00) 00000-0000" value={form.telefone} onChange={set('telefone')} /></div>
                  </div>
                  <div className="form-group form-group-full">
                    <label>Endereço</label>
                    <div className="input-wrap"><MapPin size={15} className="input-icon" />
                      <input className="form-input" placeholder="Rua, número, bairro, cidade - UF" value={form.endereco} onChange={set('endereco')} /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 – Dados Profissionais */}
            {step === 1 && (
              <div className="form-step fade-in">
                <div className="step-head">
                  <Briefcase size={20} style={{color:'var(--primary-light)'}} />
                  <h2>Dados Profissionais</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Cargo *</label>
                    <div className="input-wrap"><Briefcase size={15} className="input-icon" />
                      <input className="form-input" placeholder="Ex: Analista de RH" value={form.cargo} onChange={set('cargo')} /></div>
                  </div>
                  <div className="form-group">
                    <label>Departamento *</label>
                    <div className="input-wrap"><Briefcase size={15} className="input-icon" />
                      <select className="form-input" value={form.departamento} onChange={set('departamento')}>
                        <option value="">Selecione...</option>
                        <option>Recursos Humanos</option>
                        <option>Tecnologia</option>
                        <option>Financeiro</option>
                        <option>Marketing</option>
                        <option>Operações</option>
                        <option>Jurídico</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Gestor Responsável</label>
                    <div className="input-wrap"><User size={15} className="input-icon" />
                      <input className="form-input" placeholder="Nome do gestor" value={form.gestor} onChange={set('gestor')} /></div>
                  </div>
                  <div className="form-group">
                    <label>Data de Ingresso</label>
                    <div className="input-wrap"><FileText size={15} className="input-icon" />
                      <input className="form-input" type="date" value={form.dataIngresso} onChange={set('dataIngresso')} /></div>
                  </div>
                  <div className="form-group form-group-full">
                    <label>Regime de Contratação</label>
                    <div className="input-wrap"><Briefcase size={15} className="input-icon" />
                      <select className="form-input" value={form.regime} onChange={set('regime')}>
                        <option value="">Selecione...</option>
                        <option>CLT</option>
                        <option>PJ</option>
                        <option>Estágio</option>
                        <option>Temporário</option>
                        <option>Autônomo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 – Documentos */}
            {step === 2 && (
              <div className="form-step fade-in">
                <div className="step-head">
                  <FileText size={20} style={{color:'var(--primary-light)'}} />
                  <h2>Envio de Documentos</h2>
                </div>
                <div className="doc-required">
                  {['RG ou CNH (frente e verso)','CPF','Comprovante de Residência','Carteira de Trabalho (CTPS)','Foto 3x4 recente','Certidão de Nascimento ou Casamento'].map((d,i)=>(
                    <div key={i} className="doc-req-item">
                      <div className={`doc-req-check ${docs[i] ? 'checked':''}`}>
                        {docs[i] ? <CheckCircle size={14}/> : i+1}
                      </div>
                      <span>{d}</span>
                      {docs[i] && <span className="doc-tag">{docs[i].name}</span>}
                    </div>
                  ))}
                </div>
                <label className="doc-upload-area">
                  <Upload size={32} style={{color:'var(--primary-light)', marginBottom:8}} />
                  <strong>Clique para selecionar arquivos</strong>
                  <span style={{color:'var(--text-muted)', fontSize:13}}>PDF, JPG, PNG até 10MB cada</span>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDoc} style={{display:'none'}} />
                </label>
                {docs.length > 0 && (
                  <div className="doc-uploaded">
                    {docs.map((d, i) => (
                      <div key={i} className="doc-file">
                        <FileText size={14} style={{color:'var(--primary-light)'}} />
                        <span>{d.name}</span>
                        <span style={{color:'var(--text-muted)', fontSize:11}}>{d.size}</span>
                        <CheckCircle size={14} style={{color:'var(--success)', marginLeft:'auto'}} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3 – Revisão */}
            {step === 3 && (
              <div className="form-step fade-in">
                <div className="step-head">
                  <CheckCircle size={20} style={{color:'var(--success)'}} />
                  <h2>Revisão Final</h2>
                </div>
                <div className="review-grid">
                  <div className="review-section">
                    <h3>Dados Pessoais</h3>
                    <div className="review-row"><span>Nome</span><strong>{form.nome || '—'}</strong></div>
                    <div className="review-row"><span>CPF</span><strong>{form.cpf || '—'}</strong></div>
                    <div className="review-row"><span>E-mail</span><strong>{form.email || '—'}</strong></div>
                    <div className="review-row"><span>Telefone</span><strong>{form.telefone || '—'}</strong></div>
                  </div>
                  <div className="review-section">
                    <h3>Dados Profissionais</h3>
                    <div className="review-row"><span>Cargo</span><strong>{form.cargo || '—'}</strong></div>
                    <div className="review-row"><span>Departamento</span><strong>{form.departamento || '—'}</strong></div>
                    <div className="review-row"><span>Gestor</span><strong>{form.gestor || '—'}</strong></div>
                    <div className="review-row"><span>Regime</span><strong>{form.regime || '—'}</strong></div>
                  </div>
                </div>
                <div className="review-docs">
                  <strong>Documentos ({docs.length} enviados)</strong>
                  {docs.length === 0 && <p style={{color:'var(--text-muted)',fontSize:13}}>Nenhum documento enviado.</p>}
                  {docs.map((d,i)=>(<div key={i} className="doc-file"><FileText size={14}/><span>{d.name}</span></div>))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="form-nav">
              {step > 0 && <button className="btn btn-ghost" onClick={prev}>Voltar</button>}
              <div style={{flex:1}} />
              {step < STEPS.length - 1
                ? <button className="btn btn-primary" onClick={next}>Próximo <ChevronRight size={16} /></button>
                : <button className="btn btn-primary" onClick={handleSubmit}><CheckCircle size={16}/> Enviar para RH</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
