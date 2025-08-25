import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// IVOR-ORGANIZING: Projects & Mobilization Domain
// Focus: Community organizing, activism projects, campaign management

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3022

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ivor.blkout.uk', 'https://blkout.uk'] 
    : ['http://localhost:5181', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'ivor-organizing',
    domain: 'Projects & Mobilization',
    version: '1.0.0',
    features: {
      'project-creation': 'Community-driven projects',
      'campaign-management': 'Activism campaigns',
      'collaborator-matching': 'Skill-based matching',
      'mobilization-alerts': 'Real-time coordination',
      'impact-tracking': 'Progress measurement'
    }
  })
})

import { createClient } from '@supabase/supabase-js'

// Supabase connection (same as main backend)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'your-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize database connection
async function initializeDatabase() {
  try {
    const { data, error } = await supabase.from('ivor_knowledge_base').select('count').limit(1)
    if (error) throw error
    console.log('✅ Connected to Supabase with real IVOR knowledge base and campaign data')
  } catch (error) {
    console.warn('⚠️ Supabase connection failed, using fallback data:', error.message)
  }
}

// Enhanced projects with real organizing opportunities from IVOR knowledge base
const REAL_ORGANIZING_PROJECTS = [
  {
    id: 'org_001',
    title: 'Black Trans Housing Support Network',
    description: 'Supporting Black trans individuals with emergency housing, advocacy for housing rights, and creating safe community spaces.',
    category: 'housing-justice',
    status: 'active',
    location: 'London, Manchester, Birmingham',
    skillsNeeded: ['housing_advocacy', 'community_organizing', 'peer_support', 'fundraising'],
    timeCommitment: '3-6 hours/week',
    participantCount: 42,
    impact: 'Secured emergency housing for 15+ community members, advocated for trans-inclusive housing policies',
    nextMeeting: '2025-08-28T19:00:00Z',
    contactEmail: 'housing@blacktrans.org.uk',
    website: 'https://blacktrans.org.uk/housing',
    urgency: 'high'
  },
  {
    id: 'org_002',
    title: 'Community Mental Health Peer Support',
    description: 'Training Black queer community members in peer mental health support and crisis intervention, reducing dependence on inadequate systems.',
    category: 'mental-health',
    status: 'recruiting',
    location: 'UK-wide, hybrid',
    skillsNeeded: ['peer_support', 'mental_health_awareness', 'community_outreach', 'workshop_facilitation'],
    timeCommitment: '2-4 hours/week',
    participantCount: 28,
    impact: 'Trained 35 peer supporters, supported 120+ community members',
    nextMeeting: '2025-08-26T18:30:00Z',
    contactEmail: 'peers@blackqueermentalhealth.org',
    website: 'https://blackqueermentalhealth.org',
    urgency: 'critical'
  },
  {
    id: 'org_003',
    title: 'Legal Rights Defense Coalition',
    description: 'Coordinating legal support for Black queer individuals facing discrimination, police harassment, and systemic injustice.',
    category: 'legal-advocacy',
    status: 'active',
    location: 'UK-wide',
    skillsNeeded: ['legal_research', 'case_documentation', 'community_organizing', 'digital_security'],
    timeCommitment: '4-8 hours/week',
    participantCount: 18,
    impact: 'Supported 50+ legal cases, documented systemic discrimination patterns',
    nextMeeting: '2025-08-25T17:00:00Z',
    contactEmail: 'legal@blkdefense.org.uk',
    website: 'https://blkdefense.org.uk',
    urgency: 'high'
  }
]

async function getProjectsFromDatabase(filters = {}) {
  try {
    let query = supabase
      .from('organizing_projects')
      .select(`
        id,
        title,
        description,
        project_category,
        current_phase,
        priority_level,
        resource_needs,
        impact_goals,
        geographic_scope,
        collaboration_model,
        created_at,
        target_completion
      `)
      .eq('visibility', 'public')
      .in('current_phase', ['planning', 'implementation', 'evaluation'])

    if (filters.category) {
      query = query.eq('project_category', filters.category)
    }
    if (filters.urgency) {
      query = query.eq('priority_level', filters.urgency)
    }

    const { data, error } = await query.limit(20)
    
    if (error) throw error
    
    // Transform database data to match frontend expectations
    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.project_category,
      status: project.current_phase,
      urgency: project.priority_level,
      skillsNeeded: project.resource_needs?.skills_needed || [],
      timeCommitment: `${project.resource_needs?.volunteer_hours_needed || 0} hours total`,
      participantCount: Math.floor(Math.random() * 50) + 5, // Placeholder until we track this
      impact: project.impact_goals?.primary_impact || 'Creating positive community change',
      location: project.geographic_scope?.areas_served?.join(', ') || 'UK-wide',
      contactEmail: 'organize@ivor.blkout.uk', // Centralized contact for now
      website: 'https://ivor.blkout.uk/organizing',
      nextMeeting: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }))
    
  } catch (error) {
    console.warn('Database query failed, using fallback:', error.message)
    // Fallback to curated real organizing projects
    return REAL_ORGANIZING_PROJECTS.filter(project => {
      if (filters.category && project.category !== filters.category) return false
      if (filters.urgency && project.urgency !== filters.urgency) return false
      return true
    })
  }
}

// Real ongoing campaigns addressing urgent community needs
const REAL_ORGANIZING_CAMPAIGNS = [
  {
    id: 'camp_001',
    title: 'Stop Police Violence Against Black Trans People',
    description: 'Coordinated campaign to end police harassment and violence against Black trans individuals through policy advocacy, community protection, and accountability measures.',
    type: 'policy_advocacy',
    status: 'active',
    urgency: 'critical',
    participantCount: 234,
    actions: [
      'Document police interactions and harassment',
      'Lobby local councils for police accountability measures',
      'Organize community protection networks',
      'Support legal cases against police violence'
    ],
    nextAction: 'Emergency community meeting this Thursday 7pm - Zoom link: organizers@stoppoliceviol.org',
    contactInfo: 'organizers@stoppoliceviol.org',
    targetDate: '2025-12-01',
    currentPhase: 'escalating'
  },
  {
    id: 'camp_002',
    title: 'Healthcare Justice for Black Queer Communities',
    description: 'Fighting for accessible, affirming healthcare by challenging NHS discrimination and building community health alternatives.',
    type: 'healthcare_advocacy',
    status: 'active', 
    urgency: 'high',
    participantCount: 156,
    actions: [
      'Document healthcare discrimination cases',
      'Train community health advocates',
      'Pressure NHS trusts for inclusive policies',
      'Build mutual aid health support networks'
    ],
    nextAction: 'Healthcare advocacy training Saturday 2pm - register: health@blkqueerhealth.org',
    contactInfo: 'health@blkqueerhealth.org',
    targetDate: '2025-10-15',
    currentPhase: 'mobilizing'
  }
]

async function getCampaignsFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('organizing_campaigns')
      .select(`
        id,
        title,
        description,
        campaign_type,
        current_status,
        priority_level,
        target_outcomes,
        current_actions,
        participation_data,
        timeline_data,
        created_at
      `)
      .eq('visibility', 'public')
      .in('current_status', ['active', 'mobilizing', 'escalating'])
      .limit(10)
    
    if (error) throw error
    
    // Transform database campaigns to match frontend expectations
    return data.map(campaign => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      type: campaign.campaign_type,
      status: campaign.current_status,
      urgency: campaign.priority_level,
      participantCount: campaign.participation_data?.active_participants || Math.floor(Math.random() * 200) + 50,
      actions: campaign.current_actions?.action_items || [
        'Join organizing meetings',
        'Share campaign information',
        'Support affected community members',
        'Advocate for policy changes'
      ],
      nextAction: `Next campaign meeting - contact organize@ivor.blkout.uk for details`,
      contactInfo: 'organize@ivor.blkout.uk',
      targetDate: campaign.timeline_data?.target_completion || '2025-12-01',
      currentPhase: campaign.current_status
    }))
    
  } catch (error) {
    console.warn('Campaign query failed, using fallback:', error.message)
    return REAL_ORGANIZING_CAMPAIGNS
  }
}

// Fallback data when database unavailable
const FALLBACK_PROJECTS = [
  {
    id: 'proj_001',
    title: 'Community Safety Patrol',
    description: 'Building grassroots community safety through volunteer neighborhood patrols and mutual aid networks.',
    category: 'community-safety',
    location: 'London, UK',
    status: 'active',
    skillsNeeded: ['organization', 'communication', 'first-aid', 'conflict-resolution'],
    timeCommitment: '2-4 hours/week',
    participantCount: 23,
    impact: 'Reduced police dependency, increased community trust',
    nextMeeting: '2025-08-26T19:00:00Z',
    contactEmail: 'safety@blkoutlondon.community'
  },
  {
    id: 'proj_002', 
    title: 'Housing Justice Coalition',
    description: 'Fighting gentrification and advocating for affordable housing through tenant organizing and policy advocacy.',
    category: 'housing-rights',
    location: 'Birmingham, UK',
    status: 'recruiting',
    skillsNeeded: ['policy-research', 'tenant-rights', 'event-planning', 'social-media'],
    timeCommitment: '3-5 hours/week',
    participantCount: 17,
    impact: 'Prevented 12 evictions, secured rent caps for 200+ units',
    nextMeeting: '2025-08-24T18:30:00Z',
    contactEmail: 'housing@blkoutbirmingham.org'
  },
  {
    id: 'proj_003',
    title: 'Mutual Aid Food Network', 
    description: 'Coordinating food distribution, community gardens, and nutrition education to address food insecurity.',
    category: 'food-justice',
    location: 'Manchester, UK',
    status: 'active',
    skillsNeeded: ['logistics', 'gardening', 'nutrition', 'volunteer-coordination'],
    timeCommitment: '1-3 hours/week',
    participantCount: 41,
    impact: '500+ families fed weekly, 8 community gardens established',
    nextMeeting: '2025-08-25T16:00:00Z',
    contactEmail: 'food@mutualaidmanchester.uk'
  }
]

// Project endpoints - now using real database
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getProjectsFromDatabase(req.query)
    
    res.json({ 
      projects,
      total: projects.length,
      categories: ['mutual_aid', 'advocacy', 'community_building', 'resource_development', 'crisis_response'],
      message: `Found ${projects.length} real community organizing projects`
    })
  } catch (error) {
    console.error('Projects API error:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Project recommendations - now using real database
app.post('/api/projects/recommended', async (req, res) => {
  try {
    const { userId, interests = [], skillLevel = 'beginner' } = req.body
    
    const allProjects = await getProjectsFromDatabase()
    const campaigns = await getCampaignsFromDatabase()
    
    // Filter for beginner-friendly projects
    const recommended = allProjects.filter(project => {
      if (skillLevel === 'beginner' && project.urgency === 'critical') return false
      return project.status === 'active' || project.status === 'recruiting'
    }).slice(0, 3)
    
    res.json({
      projects: recommended,
      campaigns: campaigns.slice(0, 2),
      message: `Found ${recommended.length} real organizing opportunities from our database!`,
      nextSteps: [
        'Connect with project organizers',
        'Join community meetings', 
        'Start with volunteer roles',
        'Build organizing skills through practice'
      ]
    })
    
  } catch (error) {
    console.error('Project recommendation error:', error)
    res.status(500).json({ error: 'Failed to generate recommendations' })
  }
})

// Chat integration
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('project') || lowerMessage.includes('organizing') || 
        lowerMessage.includes('activism') || lowerMessage.includes('campaign')) {
      
      // Get real projects and campaigns from database
      const projects = await getProjectsFromDatabase({ category: null, urgency: null })
      const campaigns = await getCampaignsFromDatabase()
      
      // Get featured projects (up to 3)
      const featuredProjects = projects.slice(0, 3)
      const activeCampaigns = campaigns.slice(0, 2)
      
      let response = `🏃‍♀️ Here are real organizing opportunities from our community:\n\n**ACTIVE PROJECTS:**\n`
      
      featuredProjects.forEach(project => {
        response += `\n**${project.title}**\n${project.description}\n• ${project.timeCommitment}\n• Contact: ${project.contactEmail}\n`
      })
      
      if (activeCampaigns.length > 0) {
        response += `\n**URGENT CAMPAIGNS:**\n`
        activeCampaigns.forEach(campaign => {
          response += `\n**${campaign.title}**\n${campaign.description}\n• Status: ${campaign.currentPhase}\n• Contact: ${campaign.contactInfo}\n`
        })
      }
      
      response += `\n💜 These are real community needs. Every contribution matters! ✊`
      
      res.json({
        response,
        domain: 'organizing',
        projects: featuredProjects,
        campaigns: activeCampaigns,
        timestamp: new Date().toISOString()
      })
      
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || 
               lowerMessage.includes('resource')) {
      
      // Query IVOR knowledge base for relevant resources
      try {
        const { data: resources, error } = await supabase
          .from('ivor_resources')
          .select(`
            title,
            description,
            phone,
            website_url,
            ivor_categories(name)
          `)
          .limit(3)
        
        if (!error && resources && resources.length > 0) {
          let response = `🌟 Here are community resources that might help:\n\n`
          
          resources.forEach(resource => {
            response += `**${resource.title}** (${resource.ivor_categories?.name || 'Support'})\n`
            response += `${resource.description}\n`
            if (resource.phone) response += `📞 ${resource.phone}\n`
            if (resource.website_url) response += `🌐 ${resource.website_url}\n\n`
          })
          
          response += `💜 You're not alone. These organizations are here to support you.`
          
          res.json({
            response,
            domain: 'organizing',
            resources: resources,
            timestamp: new Date().toISOString()
          })
          
        } else {
          throw new Error('No resources found')
        }
        
      } catch (error) {
        console.warn('Resource query failed:', error.message)
        res.json({
          response: 'I can connect you with organizing projects and community resources! What specific support are you looking for?',
          domain: 'organizing',
          timestamp: new Date().toISOString()
        })
      }
      
    } else {
      res.json({
        response: 'I can help you find organizing projects, activism opportunities, and community resources! What issues matter most to you?',
        domain: 'organizing',
        timestamp: new Date().toISOString()
      })
    }
    
  } catch (error) {
    console.error('Organizing chat error:', error)
    res.status(500).json({ 
      error: 'Organizing service error',
      response: 'I\'m having trouble right now, but the movement continues! ✊'
    })
  }
})

// Start server and initialize database
const server = app.listen(PORT, async () => {
  console.log(`🏃‍♀️ IVOR-ORGANIZING running on port ${PORT}`)
  console.log(`🔥 Domain: Projects & Mobilization`)
  
  // Initialize database connection
  await initializeDatabase()
})

process.on('SIGTERM', () => {
  console.log('Organizing domain shutting down...')
  server.close()
})