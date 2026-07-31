import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockState = vi.hoisted(() => {
  let configured = true
  let queryResult = { data: [], error: null }

  function buildQuery() {
    const promise = Promise.resolve(queryResult)
    const chain = {
      select: vi.fn(() => chain),
      order: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      single: vi.fn(() => chain),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      delete: vi.fn(() => chain),
      upsert: vi.fn(() => chain),
      onConflict: vi.fn(() => chain),
      then: (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected),
      catch: (onRejected) => promise.catch(onRejected),
      finally: (onFinally) => promise.finally(onFinally),
    }
    return chain
  }

  const fromFn = vi.fn(() => buildQuery())
  const authObj = {
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
    signInWithOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    verifyOtp: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } } }),
  }
  const uploadFn = vi.fn().mockResolvedValue({ data: { path: 'test.png' }, error: null })
  const getPublicUrlFn = vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.png' } })
  const storageObj = {
    from: vi.fn(() => ({ upload: uploadFn, getPublicUrl: getPublicUrlFn })),
  }

  return {
    setConfigured(v) { configured = v },
    setQueryResult(r) { queryResult = r },
    getQueryResult() { return queryResult },
    get configured() { return configured },
    fromFn,
    authObj,
    uploadFn,
    getPublicUrlFn,
    storageObj,
    supabase: { from: fromFn, auth: authObj, storage: storageObj },
  }
})

const mockFetch = vi.fn().mockResolvedValue({ ok: true })

vi.mock('../supabaseClient', () => ({
  supabaseUrl: 'https://project.supabase.co',
  supabaseAnonKey: 'test-anon-key',
  get isSupabaseConfigured() { return mockState.configured },
  supabase: mockState.supabase,
}))

vi.stubGlobal('fetch', mockFetch)

vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => '00000000-0000-0000-0000-000000000000'),
})

beforeEach(() => {
  vi.resetModules()
  mockFetch.mockClear()
  mockState.setConfigured(true)
  mockState.setQueryResult({ data: [], error: null })
  mockState.fromFn.mockClear()
  mockState.authObj.signInWithPassword.mockClear()
  mockState.authObj.signInWithOtp.mockClear()
  mockState.authObj.verifyOtp.mockClear()
  mockState.authObj.updateUser.mockClear()
  mockState.authObj.signOut.mockClear()
  mockState.authObj.getSession.mockClear()
  mockState.uploadFn.mockClear()
  mockState.getPublicUrlFn.mockClear()
  mockState.storageObj.from.mockClear()
  localStorage.clear()
})

describe('module-level state', () => {
  it('getProfileSource() returns "fallback" initially', async () => {
    const { getProfileSource } = await import('../api')
    expect(getProfileSource()).toBe('fallback')
  })

  it('getProfileSource() returns "supabase" after liveSourceDetected', async () => {
    mockState.setQueryResult({ data: { value: { name: 'test' } }, error: null })
    const { getProfileSource, fetchProfile } = await import('../api')
    await fetchProfile()
    expect(getProfileSource()).toBe('supabase')
  })

  it('isUsingLiveData() returns true when configured and table available', async () => {
    const { isUsingLiveData } = await import('../api')
    expect(isUsingLiveData()).toBe(true)
  })

  it('isUsingLiveData() returns false when not configured', async () => {
    mockState.setConfigured(false)
    const { isUsingLiveData } = await import('../api')
    expect(isUsingLiveData()).toBe(false)
  })

  it('isUsingLiveData() returns false when supabase is unavailable', async () => {
    mockState.setQueryResult({ data: null, error: new Error('42P01') })
    const { isUsingLiveData, fetchProfile } = await import('../api')
    await fetchProfile().catch(() => {})
    expect(isUsingLiveData()).toBe(false)
  })
})

describe('fetchProjects()', () => {
  it('returns projects from Supabase when data exists', async () => {
    const projectsData = [{ id: '1', title: 'Project A' }]
    mockState.setQueryResult({ data: projectsData, error: null })
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    expect(result).toEqual(projectsData)
  })

  it('pings PostgREST readiness endpoint with apikey header before fetching', async () => {
    mockState.setQueryResult({ data: [{ id: '1' }], error: null })
    const { fetchProjects } = await import('../api')
    await fetchProjects()
    expect(mockFetch).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/settings?select=key&limit=1',
      expect.objectContaining({
        headers: expect.objectContaining({
          apikey: 'test-anon-key',
          Authorization: 'Bearer test-anon-key',
        }),
      })
    )
  })

  it('returns fallback projects when Supabus returns empty', async () => {
    mockState.setQueryResult({ data: [], error: null })
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].title).toBe('Mini Shop — Plateforme e-commerce')
  })

  it('returns fallback when Supabase errors', async () => {
    mockState.setQueryResult({ data: null, error: new Error('network error') })
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns demo projects when not configured', async () => {
    mockState.setConfigured(false)
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
  })

  it('persists demo projects in localStorage', async () => {
    mockState.setConfigured(false)
    const { fetchProjects } = await import('../api')
    await fetchProjects()
    const stored = JSON.parse(localStorage.getItem('portfolio_demo_projects'))
    expect(stored).toBeDefined()
    expect(stored.length).toBeGreaterThan(0)
  })

  it('skips Supabase on subsequent calls after first error', async () => {
    mockState.setQueryResult({ data: null, error: new Error('401 Unauthorized') })
    const { fetchProjects } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await fetchProjects()
    const callCount = s.from.mock.calls.length
    mockState.setQueryResult({ data: [{ id: '1', title: 'Would be returned' }], error: null })
    await fetchProjects()
    expect(s.from.mock.calls.length).toBe(callCount)
  })
})

describe('fetchProjectById(id)', () => {
  it('returns matching project from Supabase', async () => {
    const project = { id: '1', title: 'Found' }
    mockState.setQueryResult({ data: project, error: null })
    const { fetchProjectById } = await import('../api')
    const result = await fetchProjectById('1')
    expect(result).toEqual(project)
  })

  it('returns null when project not found', async () => {
    mockState.setQueryResult({ data: null, error: new Error('not found') })
    const { fetchProjectById } = await import('../api')
    const result = await fetchProjectById('nonexistent')
    expect(result).toBeNull()
  })

  it('falls back to demo when Supabase errors', async () => {
    mockState.setQueryResult({ data: null, error: new Error('network error') })
    const { fetchProjectById } = await import('../api')
    const result = await fetchProjectById('1')
    expect(result).not.toBeNull()
    expect(result.id).toBe('1')
  })

  it('finds project in demo data when not configured', async () => {
    mockState.setConfigured(false)
    const { fetchProjectById } = await import('../api')
    const result = await fetchProjectById('1')
    expect(result).not.toBeNull()
    expect(result.title).toBe('Mini Shop — Plateforme e-commerce')
  })

  it('returns null when id not found in demo data', async () => {
    mockState.setConfigured(false)
    const { fetchProjectById } = await import('../api')
    const result = await fetchProjectById('nonexistent')
    expect(result).toBeNull()
  })
})

describe('fetchExperiences()', () => {
  it('returns experiences from Supabase', async () => {
    const experiencesData = [{ id: '1', title: 'Job', type: 'work' }]
    mockState.setQueryResult({ data: experiencesData, error: null })
    const { fetchExperiences } = await import('../api')
    const result = await fetchExperiences()
    expect(result).toEqual(experiencesData)
  })

  it('merges fallback experiences on empty data', async () => {
    mockState.setQueryResult({ data: [], error: null })
    const { fetchExperiences } = await import('../api')
    const result = await fetchExperiences()
    expect(result.length).toBeGreaterThan(0)
  })

  it('merges fallback experiences on error', async () => {
    mockState.setQueryResult({ data: null, error: new Error('db error') })
    const { fetchExperiences } = await import('../api')
    const result = await fetchExperiences()
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns demo experiences when not configured', async () => {
    mockState.setConfigured(false)
    const { fetchExperiences } = await import('../api')
    const result = await fetchExperiences()
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('submitContactMessage()', () => {
  it('submits message to Supabase', async () => {
    mockState.setQueryResult({ data: null, error: null })
    const { submitContactMessage } = await import('../api')
    const result = await submitContactMessage({
      name: 'Test User', email: 'test@example.com', message: 'Hello there!',
    })
    expect(result).toEqual({ success: true })
  })

  it('throws on Supabase error', async () => {
    mockState.setQueryResult({ data: null, error: new Error('insert failed') })
    const { submitContactMessage } = await import('../api')
    await expect(
      submitContactMessage({ name: 'Test', email: 'test@test.com', message: 'Hello there!' })
    ).rejects.toThrow('insert failed')
  })

  it('saves to localStorage when not configured', async () => {
    mockState.setConfigured(false)
    const { submitContactMessage } = await import('../api')
    const result = await submitContactMessage({
      name: 'Test', email: 'test@test.com', message: 'Hello world!',
    })
    expect(result).toEqual({ success: true, demo: true })
    const stored = JSON.parse(localStorage.getItem('portfolio_demo_messages'))
    expect(stored.length).toBe(1)
    expect(stored[0].name).toBe('Test')
  })
})

describe('signInAdmin / signOutAdmin / getSession', () => {
  it('signInAdmin calls supabase.auth.signInWithPassword', async () => {
    const { signInAdmin } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await signInAdmin('admin@test.com', 'password', 'token-123')
    expect(s.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'password',
      options: { captchaToken: 'token-123' },
    })
  })

  it('signInAdmin throws on error', async () => {
    const { signInAdmin } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    s.auth.signInWithPassword.mockRejectedValueOnce(new Error('invalid credentials'))
    await expect(signInAdmin('admin@test.com', 'wrong')).rejects.toThrow()
  })

  it('signInAdmin throws when not configured', async () => {
    mockState.setConfigured(false)
    const { signInAdmin } = await import('../api')
    await expect(signInAdmin('admin@test.com', 'pass')).rejects.toThrow('Supabase non configuré')
  })

  it('signOutAdmin calls supabase.auth.signOut', async () => {
    const { signOutAdmin } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await signOutAdmin()
    expect(s.auth.signOut).toHaveBeenCalled()
  })

  it('signOutAdmin does nothing when not configured', async () => {
    mockState.setConfigured(false)
    const { signOutAdmin } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await signOutAdmin()
    expect(s.auth.signOut).not.toHaveBeenCalled()
  })

  it('getSession returns session', async () => {
    const { getSession } = await import('../api')
    const session = await getSession()
    expect(session).toEqual({ user: { id: '1' } })
  })

  it('getSession returns null when not configured', async () => {
    mockState.setConfigured(false)
    const { getSession } = await import('../api')
    const session = await getSession()
    expect(session).toBeNull()
  })
})

describe('password reset (sendPasswordResetCode / verifyPasswordResetCode / updateAdminPassword)', () => {
  it('sendPasswordResetCode calls signInWithOtp without creating a user', async () => {
    const { sendPasswordResetCode } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await sendPasswordResetCode('admin@test.com', 'captcha-123')
    expect(s.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'admin@test.com',
      options: { shouldCreateUser: false, captchaToken: 'captcha-123' },
    })
  })

  it('sendPasswordResetCode throws when not configured', async () => {
    mockState.setConfigured(false)
    const { sendPasswordResetCode } = await import('../api')
    await expect(sendPasswordResetCode('admin@test.com')).rejects.toThrow('Supabase non configuré')
  })

  it('verifyPasswordResetCode calls verifyOtp with type email', async () => {
    const { verifyPasswordResetCode } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await verifyPasswordResetCode('admin@test.com', '123456', 'captcha-123')
    expect(s.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'admin@test.com',
      token: '123456',
      type: 'email',
      options: { captchaToken: 'captcha-123' },
    })
  })

  it('verifyPasswordResetCode returns the session', async () => {
    const { verifyPasswordResetCode } = await import('../api')
    const session = await verifyPasswordResetCode('admin@test.com', '123456')
    expect(session).toEqual({ user: { id: '1' } })
  })

  it('updateAdminPassword calls updateUser and signs out', async () => {
    const { updateAdminPassword } = await import('../api')
    const { supabase: s } = await import('../supabaseClient')
    await updateAdminPassword('new-password')
    expect(s.auth.updateUser).toHaveBeenCalledWith({ password: 'new-password' })
    expect(s.auth.signOut).toHaveBeenCalled()
  })
})

describe('uploadImage(file)', () => {
  function createFile() {
    return new File(['test'], 'image.png', { type: 'image/png' })
  }

  it('uploads to Supabase storage and returns public URL', async () => {
    const { uploadImage } = await import('../api')
    const result = await uploadImage(createFile())
    expect(result).toBe('https://example.com/test.png')
  })

  it('falls back to data URL on storage error', async () => {
    mockState.uploadFn.mockResolvedValueOnce({ data: null, error: new Error('storage full') })
    const { uploadImage } = await import('../api')
    const result = await uploadImage(createFile())
    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('falls back to data URL when not configured', async () => {
    mockState.setConfigured(false)
    const { uploadImage } = await import('../api')
    const result = await uploadImage(createFile())
    expect(result).toMatch(/^data:image\/png;base64,/)
  })
})

describe('CRUD: Projects', () => {
  describe('createProject', () => {
    it('inserts into Supabase', async () => {
      const created = { id: '1', title: 'New Project' }
      mockState.setQueryResult({ data: created, error: null })
      const { createProject } = await import('../api')
      const result = await createProject({ title: 'New Project' })
      expect(result).toEqual(created)
    })

    it('throws on Supabase error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('insert failed') })
      const { createProject } = await import('../api')
      await expect(createProject({ title: 'Fail' })).rejects.toThrow('insert failed')
    })

    it('falls back to localStorage when not configured', async () => {
      mockState.setConfigured(false)
      const { createProject } = await import('../api')
      const result = await createProject({ title: 'Demo Project' })
      expect(result.id).toBeDefined()
      expect(result.title).toBe('Demo Project')
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_projects'))
      expect(stored[0].title).toBe('Demo Project')
    })
  })

  describe('updateProject', () => {
    it('updates Supabase row', async () => {
      const updated = { id: '1', title: 'Updated' }
      mockState.setQueryResult({ data: updated, error: null })
      const { updateProject } = await import('../api')
      const result = await updateProject('1', { title: 'Updated' })
      expect(result).toEqual(updated)
    })

    it('throws on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('update failed') })
      const { updateProject } = await import('../api')
      await expect(updateProject('1', { title: 'Fail' })).rejects.toThrow('update failed')
    })

    it('updates localStorage when not configured', async () => {
      mockState.setConfigured(false)
      localStorage.setItem('portfolio_demo_projects', JSON.stringify([{ id: '1', title: 'Old' }]))
      const { updateProject } = await import('../api')
      await updateProject('1', { title: 'Updated' })
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_projects'))
      expect(stored[0].title).toBe('Updated')
    })
  })

  describe('deleteProject', () => {
    it('deletes Supabase row', async () => {
      mockState.setQueryResult({ data: null, error: null })
      const { deleteProject } = await import('../api')
      await expect(deleteProject('1')).resolves.toBeUndefined()
    })

    it('throws on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('delete failed') })
      const { deleteProject } = await import('../api')
      await expect(deleteProject('1')).rejects.toThrow('delete failed')
    })

    it('deletes from localStorage when not configured', async () => {
      mockState.setConfigured(false)
      localStorage.setItem('portfolio_demo_projects', JSON.stringify([
        { id: '1', title: 'To Delete' }, { id: '2', title: 'Keep' },
      ]))
      const { deleteProject } = await import('../api')
      await deleteProject('1')
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_projects'))
      expect(stored.length).toBe(1)
      expect(stored[0].id).toBe('2')
    })
  })
})

describe('CRUD: Experiences', () => {
  describe('createExperience', () => {
    it('inserts into Supabase', async () => {
      const created = { id: '1', title: 'New Exp' }
      mockState.setQueryResult({ data: created, error: null })
      const { createExperience } = await import('../api')
      const result = await createExperience({ title: 'New Exp' })
      expect(result).toEqual(created)
    })

    it('throws on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('insert failed') })
      const { createExperience } = await import('../api')
      await expect(createExperience({ title: 'Fail' })).rejects.toThrow('insert failed')
    })

    it('creates in localStorage when not configured', async () => {
      mockState.setConfigured(false)
      const { createExperience } = await import('../api')
      const result = await createExperience({ title: 'Demo Exp' })
      expect(result.id).toBeDefined()
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_experiences'))
      expect(stored.some(e => e.title === 'Demo Exp')).toBe(true)
    })
  })

  describe('updateExperience', () => {
    it('updates Supabase row', async () => {
      const updated = { id: '1', title: 'Updated' }
      mockState.setQueryResult({ data: updated, error: null })
      const { updateExperience } = await import('../api')
      const result = await updateExperience('1', { title: 'Updated' })
      expect(result).toEqual(updated)
    })

    it('throws on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('update failed') })
      const { updateExperience } = await import('../api')
      await expect(updateExperience('1', { title: 'Fail' })).rejects.toThrow('update failed')
    })
  })

  describe('deleteExperience', () => {
    it('deletes Supabase row', async () => {
      mockState.setQueryResult({ data: null, error: null })
      const { deleteExperience } = await import('../api')
      await expect(deleteExperience('1')).resolves.toBeUndefined()
    })

    it('throws on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('delete failed') })
      const { deleteExperience } = await import('../api')
      await expect(deleteExperience('1')).rejects.toThrow('delete failed')
    })
  })
})

describe('fetchMessages / deleteMessage', () => {
  it('fetchMessages returns messages from Supabase', async () => {
    const messages = [{ id: '1', name: 'Sender' }]
    mockState.setQueryResult({ data: messages, error: null })
    const { fetchMessages } = await import('../api')
    const result = await fetchMessages()
    expect(result).toEqual(messages)
  })

  it('fetchMessages returns [] on error', async () => {
    mockState.setQueryResult({ data: null, error: new Error('db error') })
    const { fetchMessages } = await import('../api')
    const result = await fetchMessages()
    expect(result).toEqual([])
  })

  it('fetchMessages returns demo messages when not configured', async () => {
    mockState.setConfigured(false)
    localStorage.setItem('portfolio_demo_messages', JSON.stringify([{ id: '1', name: 'Demo' }]))
    const { fetchMessages } = await import('../api')
    const result = await fetchMessages()
    expect(result).toEqual([{ id: '1', name: 'Demo' }])
  })

  it('deleteMessage deletes from Supabase', async () => {
    mockState.setQueryResult({ data: null, error: null })
    const { deleteMessage } = await import('../api')
    await expect(deleteMessage('1')).resolves.toBeUndefined()
  })

  it('deleteMessage throws on error', async () => {
    mockState.setQueryResult({ data: null, error: new Error('delete failed') })
    const { deleteMessage } = await import('../api')
    await expect(deleteMessage('1')).rejects.toThrow('delete failed')
  })
})

describe('Settings (Profile / Skills / Languages)', () => {
  describe('fetchFromSettings', () => {
    it('returns data from Supabase settings table', async () => {
      mockState.setQueryResult({ data: { value: { name: 'Test Profile' } }, error: null })
      const { fetchProfile } = await import('../api')
      const result = await fetchProfile()
      expect(result.name).toBe('Test Profile')
    })

    it('sets liveSourceDetected on success', async () => {
      mockState.setQueryResult({ data: { value: { name: 'Test' } }, error: null })
      const { fetchProfile, getProfileSource } = await import('../api')
      await fetchProfile()
      expect(getProfileSource()).toBe('supabase')
    })

    it('falls back to demo settings when table missing', async () => {
      mockState.setQueryResult({ data: null, error: new Error('relation "settings" does not exist') })
      const { fetchProfile } = await import('../api')
      const result = await fetchProfile()
      expect(result.name).toBe('Ilham')
    })

    it('falls back to demo settings on any error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('network error') })
      const { fetchProfile } = await import('../api')
      const result = await fetchProfile()
      expect(result.name).toBe('Ilham')
    })

    it('returns demo settings when not configured', async () => {
      mockState.setConfigured(false)
      const { fetchProfile } = await import('../api')
      const result = await fetchProfile()
      expect(result.name).toBe('Ilham')
    })
  })

  describe('saveToSettings', () => {
    it('upserts into Supabase', async () => {
      mockState.setQueryResult({ data: null, error: null })
      const { updateProfile } = await import('../api')
      const result = await updateProfile({ name: 'Updated' })
      expect(result).toEqual({ name: 'Updated' })
    })

    it('falls back to localStorage on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('upsert failed') })
      const { updateProfile } = await import('../api')
      const result = await updateProfile({ name: 'Fallback' })
      expect(result).toEqual({ name: 'Fallback' })
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_settings'))
      expect(stored.profile.name).toBe('Fallback')
    })

    it('saves to localStorage when not configured', async () => {
      mockState.setConfigured(false)
      const { updateProfile } = await import('../api')
      const result = await updateProfile({ name: 'Offline' })
      expect(result).toEqual({ name: 'Offline' })
      const stored = JSON.parse(localStorage.getItem('portfolio_demo_settings'))
      expect(stored.profile.name).toBe('Offline')
    })
  })

  describe('fetchSkills / fetchLanguages', () => {
    it('fetchSkills returns skills from settings', async () => {
      const skillsData = [{ category: 'Frontend', items: [] }]
      mockState.setQueryResult({ data: { value: skillsData }, error: null })
      const { fetchSkills } = await import('../api')
      const result = await fetchSkills()
      expect(result).toEqual(skillsData)
    })

    it('fetchLanguages returns fallback languages on error', async () => {
      mockState.setQueryResult({ data: null, error: new Error('db error') })
      const { fetchLanguages } = await import('../api')
      const result = await fetchLanguages()
      expect(result.length).toBeGreaterThan(0)
    })

    it('fetchLanguages returns demo languages when not configured', async () => {
      mockState.setConfigured(false)
      const { fetchLanguages } = await import('../api')
      const result = await fetchLanguages()
      expect(result.length).toBeGreaterThan(0)
    })
  })
})

describe('migrateProfile', () => {
  it('converts legacy about.focus array to object', async () => {
    const legacy = {
      name: 'Legacy',
      about: { bio: 'test', focus: [{ name: 'React', level: 80 }] },
    }
    mockState.setQueryResult({ data: { value: legacy }, error: null })
    const { fetchProfile } = await import('../api')
    const result = await fetchProfile()
    expect(Array.isArray(result.about.focus)).toBe(false)
    expect(result.about.focus).toEqual({ web: [{ name: 'React', level: 80 }], mobile: [] })
  })

  it('builds stack from focus when stack is missing', async () => {
    const legacy = {
      name: 'Legacy',
      about: { bio: 'test', focus: { web: [{ name: 'React', level: 80 }], mobile: [] } },
    }
    mockState.setQueryResult({ data: { value: legacy }, error: null })
    const { fetchProfile } = await import('../api')
    const result = await fetchProfile()
    expect(result.about.stack).toBeDefined()
    expect(result.about.stack.length).toBeGreaterThan(0)
  })

  it('leaves modern profile unchanged', async () => {
    const modern = {
      name: 'Modern',
      about: { bio: 'test', focus: { web: [], mobile: [] }, stack: [{ category: 'Frontend', items: [] }] },
    }
    mockState.setQueryResult({ data: { value: modern }, error: null })
    const { fetchProfile } = await import('../api')
    const result = await fetchProfile()
    expect(result.about.stack).toEqual(modern.about.stack)
  })
})

describe('fallback helpers (loadFromStorage / getDemoSettings)', () => {
  it('loadFromStorage returns fallback and persists when key missing (not configured)', async () => {
    mockState.setConfigured(false)
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    const stored = JSON.parse(localStorage.getItem('portfolio_demo_projects'))
    expect(stored).toEqual(result)
  })

  it('loadFromStorage handles corrupted JSON', async () => {
    localStorage.setItem('portfolio_demo_projects', 'not-valid-json')
    mockState.setConfigured(false)
    const { fetchProjects } = await import('../api')
    const result = await fetchProjects()
    expect(result.length).toBeGreaterThan(0)
  })

  it('getDemoSettings returns parsed settings from localStorage', async () => {
    const custom = { profile: { name: 'Custom' }, skills: [], languages: [] }
    localStorage.setItem('portfolio_demo_settings', JSON.stringify(custom))
    mockState.setConfigured(false)
    const { fetchProfile } = await import('../api')
    const result = await fetchProfile()
    expect(result.name).toBe('Custom')
  })

  it('getDemoSettings handles corrupted JSON', async () => {
    localStorage.setItem('portfolio_demo_settings', '{broken')
    mockState.setConfigured(false)
    const { fetchProfile } = await import('../api')
    const result = await fetchProfile()
    expect(result.name).toBe('Ilham')
  })
})
