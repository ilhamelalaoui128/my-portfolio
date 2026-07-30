export const isSupabaseConfigured = true

function buildQuery(returns) {
  const q = vi.fn()
  q.select = vi.fn().mockReturnThis()
  q.order = vi.fn().mockReturnThis()
  q.eq = vi.fn().mockReturnThis()
  q.single = vi.fn().mockResolvedValue(returns)
  q.insert = vi.fn().mockReturnThis()
  q.update = vi.fn().mockReturnThis()
  q.delete = vi.fn().mockReturnThis()
  q.upsert = vi.fn().mockReturnThis()
  q.onConflict = vi.fn().mockReturnThis()

  q.select.mockResolvedValue(returns)
  q.insert.mockResolvedValue(returns)
  q.update.mockResolvedValue(returns)
  q.delete.mockResolvedValue(returns)
  q.upsert.mockResolvedValue(returns)
  return q
}

function auth() {
  return {
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } } }),
  }
}

function storage() {
  const upload = vi.fn().mockResolvedValue({ data: { path: 'test.png' }, error: null })
  const getPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.png' } })

  return {
    from: vi.fn(() => ({ upload, getPublicUrl })),
  }
}

const defaultResolve = { data: [], error: null }

export const supabase = {
  from: vi.fn(() => buildQuery(defaultResolve)),
  auth: auth(),
  storage: storage(),
}
