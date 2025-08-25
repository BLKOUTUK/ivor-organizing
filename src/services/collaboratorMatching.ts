// IVOR Organizing - Collaborator Matching Service
// AI-powered skill matching and community collaboration algorithms

interface SkillProfile {
  id: string
  userName: string
  userEmail?: string
  skills: Array<{
    skill: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    experience: string
    verified: boolean
  }>
  interests: string[]
  availability: string
  preferredCommitment: string
  location?: string
  bio?: string
  isActive: boolean
  matchHistory: Array<{
    projectId: string
    matchScore: number
    joined: boolean
  }>
}

interface ProjectRequirements {
  id: string
  requiredSkills: Array<{
    skill: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    priority: 'low' | 'medium' | 'high' | 'critical'
    isRequired: boolean
  }>
  category: string
  timeline: string
  timeCommitment: string
  location?: string
  remoteOk: boolean
  description: string
}

interface CollaboratorMatch {
  profile: SkillProfile
  matchScore: number
  skillMatches: Array<{
    skill: string
    profileLevel: string
    requiredLevel: string
    scoreContribution: number
  }>
  interestAlignment: number
  availabilityMatch: boolean
  locationMatch: boolean
  confidenceScore: number
  recommendationReason: string[]
}

export class CollaboratorMatchingService {
  private skillProfiles: SkillProfile[] = []
  
  constructor() {
    this.initializeTestProfiles()
  }

  // Initialize with sample community skill profiles
  private initializeTestProfiles() {
    this.skillProfiles = [
      {
        id: 'profile-1',
        userName: 'Alex Rivera',
        userEmail: 'alex.rivera@community.org',
        skills: [
          { skill: 'Community Organizing', level: 'expert', experience: '8 years organizing housing justice campaigns', verified: true },
          { skill: 'Event Planning', level: 'advanced', experience: '5 years coordinating community events', verified: true },
          { skill: 'Grant Writing', level: 'intermediate', experience: 'Secured $50K+ in community grants', verified: false }
        ],
        interests: ['Housing Justice', 'Racial Equity', 'Community Development'],
        availability: '10-15 hours/week',
        preferredCommitment: '3-6 months',
        location: 'Oakland, CA',
        bio: 'Experienced community organizer passionate about housing justice and equitable development.',
        isActive: true,
        matchHistory: []
      },
      {
        id: 'profile-2',
        userName: 'Jordan Kim',
        userEmail: 'jordan@techforgood.net',
        skills: [
          { skill: 'Web Development', level: 'advanced', experience: '6 years full-stack development', verified: true },
          { skill: 'UI/UX Design', level: 'intermediate', experience: '3 years designing community platforms', verified: true },
          { skill: 'Data Analysis', level: 'advanced', experience: 'Analytics for 10+ social impact projects', verified: false }
        ],
        interests: ['Digital Equity', 'Community Tech', 'Data Justice'],
        availability: '5-10 hours/week',
        preferredCommitment: '2-4 months',
        location: 'Remote',
        bio: 'Tech professional dedicated to building digital tools that serve community needs.',
        isActive: true,
        matchHistory: []
      },
      {
        id: 'profile-3',
        userName: 'Maya Patel',
        userEmail: 'maya.patel@wellness.coop',
        skills: [
          { skill: 'Mental Health Counseling', level: 'expert', experience: '12 years trauma-informed therapy', verified: true },
          { skill: 'Workshop Facilitation', level: 'advanced', experience: 'Led 100+ community healing circles', verified: true },
          { skill: 'Curriculum Development', level: 'intermediate', experience: 'Developed culturally responsive programs', verified: false }
        ],
        interests: ['Mental Health', 'Healing Justice', 'Wellness Initiatives'],
        availability: '8-12 hours/week',
        preferredCommitment: '6+ months',
        location: 'Chicago, IL',
        bio: 'Licensed therapist specializing in community-based mental health and healing justice.',
        isActive: true,
        matchHistory: []
      },
      {
        id: 'profile-4',
        userName: 'Carlos Mendoza',
        userEmail: 'carlos.mendoza@cooperativa.mx',
        skills: [
          { skill: 'Financial Planning', level: 'advanced', experience: '7 years cooperative business development', verified: true },
          { skill: 'Project Management', level: 'expert', experience: 'Managed 20+ community infrastructure projects', verified: true },
          { skill: 'Spanish Translation', level: 'expert', experience: 'Native bilingual speaker', verified: true }
        ],
        interests: ['Economic Justice', 'Cooperative Development', 'Immigrant Rights'],
        availability: '15-20 hours/week',
        preferredCommitment: '6+ months',
        location: 'Phoenix, AZ',
        bio: 'Cooperative development specialist focused on building community wealth and economic democracy.',
        isActive: true,
        matchHistory: []
      },
      {
        id: 'profile-5',
        userName: 'Zara Johnson',
        userEmail: 'zara@artivism.collective',
        skills: [
          { skill: 'Graphic Design', level: 'advanced', experience: '5 years movement visual identity', verified: true },
          { skill: 'Social Media Strategy', level: 'intermediate', experience: 'Grew campaign reach 300%', verified: false },
          { skill: 'Photography', level: 'intermediate', experience: 'Documented 50+ community actions', verified: false }
        ],
        interests: ['Visual Storytelling', 'Cultural Arts', 'Movement Media'],
        availability: '6-10 hours/week',
        preferredCommitment: '2-6 months',
        location: 'Atlanta, GA',
        bio: 'Visual artist and communications strategist amplifying community voices through design.',
        isActive: true,
        matchHistory: []
      }
    ]
  }

  // Main matching algorithm
  public findMatches(projectRequirements: ProjectRequirements): CollaboratorMatch[] {
    const matches: CollaboratorMatch[] = []

    for (const profile of this.skillProfiles) {
      if (!profile.isActive) continue

      const match = this.calculateMatch(profile, projectRequirements)
      if (match.matchScore >= 60) { // Only include matches above 60% threshold
        matches.push(match)
      }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  // Calculate comprehensive match score
  private calculateMatch(profile: SkillProfile, requirements: ProjectRequirements): CollaboratorMatch {
    const skillMatchResult = this.calculateSkillMatch(profile.skills, requirements.requiredSkills)
    const interestAlignment = this.calculateInterestAlignment(profile.interests, requirements.category, requirements.description)
    const availabilityMatch = this.checkAvailabilityMatch(profile.availability, requirements.timeCommitment)
    const locationMatch = this.checkLocationMatch(profile.location, requirements.location, requirements.remoteOk)
    const experienceBonus = this.calculateExperienceBonus(profile.matchHistory)

    // Weighted scoring algorithm
    const weights = {
      skills: 0.45,      // 45% - Most important
      interests: 0.25,   // 25% - Strong alignment indicator
      availability: 0.15, // 15% - Practical constraint
      location: 0.10,    // 10% - Less important if remote OK
      experience: 0.05   // 5% - Small bonus for past success
    }

    const matchScore = Math.round(
      (skillMatchResult.overallScore * weights.skills) +
      (interestAlignment * weights.interests) +
      (availabilityMatch ? 100 : 50) * weights.availability +
      (locationMatch ? 100 : 60) * weights.location +
      (experienceBonus * weights.experience)
    )

    const confidenceScore = this.calculateConfidenceScore(skillMatchResult, interestAlignment, profile)
    const recommendationReasons = this.generateRecommendationReasons(skillMatchResult, interestAlignment, availabilityMatch, locationMatch, profile)

    return {
      profile,
      matchScore: Math.min(100, Math.max(0, matchScore)),
      skillMatches: skillMatchResult.matches,
      interestAlignment,
      availabilityMatch,
      locationMatch,
      confidenceScore,
      recommendationReason: recommendationReasons
    }
  }

  // Detailed skill matching with level consideration
  private calculateSkillMatch(profileSkills: SkillProfile['skills'], requiredSkills: ProjectRequirements['requiredSkills']) {
    if (requiredSkills.length === 0) return { overallScore: 75, matches: [] }

    const skillLevelValues = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
    const priorityMultipliers = { low: 1, medium: 1.5, high: 2, critical: 3 }
    
    let totalPossibleScore = 0
    let achievedScore = 0
    const matches: any[] = []

    for (const requiredSkill of requiredSkills) {
      const profileSkill = profileSkills.find(s => 
        s.skill.toLowerCase() === requiredSkill.skill.toLowerCase() ||
        this.isSkillRelated(s.skill, requiredSkill.skill)
      )

      const priorityMultiplier = priorityMultipliers[requiredSkill.priority]
      const maxPossibleForThisSkill = 100 * priorityMultiplier
      totalPossibleScore += maxPossibleForThisSkill

      if (profileSkill) {
        const profileLevel = skillLevelValues[profileSkill.level]
        const requiredLevel = skillLevelValues[requiredSkill.level]
        
        let scoreContribution: number
        if (profileLevel >= requiredLevel) {
          // Exact match or higher - full points plus bonus for exceeding
          scoreContribution = 100 + Math.min(20, (profileLevel - requiredLevel) * 5)
        } else {
          // Below required level - partial points
          scoreContribution = Math.max(30, (profileLevel / requiredLevel) * 80)
        }

        // Apply verification bonus
        if (profileSkill.verified) {
          scoreContribution *= 1.1
        }

        achievedScore += scoreContribution * priorityMultiplier

        matches.push({
          skill: requiredSkill.skill,
          profileLevel: profileSkill.level,
          requiredLevel: requiredSkill.level,
          scoreContribution: Math.round(scoreContribution)
        })
      } else if (requiredSkill.isRequired) {
        // Missing required skill - significant penalty
        achievedScore += 10 * priorityMultiplier
        matches.push({
          skill: requiredSkill.skill,
          profileLevel: 'none',
          requiredLevel: requiredSkill.level,
          scoreContribution: 0
        })
      }
    }

    const overallScore = Math.min(100, Math.round((achievedScore / totalPossibleScore) * 100))
    return { overallScore, matches }
  }

  // Check if skills are related (fuzzy matching)
  private isSkillRelated(profileSkill: string, requiredSkill: string): boolean {
    const skillMappings: { [key: string]: string[] } = {
      'Community Organizing': ['organizing', 'activism', 'advocacy', 'campaign', 'mobilization'],
      'Web Development': ['programming', 'coding', 'javascript', 'react', 'frontend', 'backend'],
      'Graphic Design': ['design', 'visual', 'branding', 'illustration', 'creative'],
      'Event Planning': ['events', 'coordination', 'logistics', 'planning'],
      'Grant Writing': ['fundraising', 'grants', 'funding', 'proposals'],
      'Project Management': ['management', 'coordination', 'planning', 'leadership'],
      'Social Media': ['marketing', 'communications', 'outreach', 'digital'],
      'Mental Health': ['counseling', 'therapy', 'wellness', 'healing', 'support']
    }

    const profileLower = profileSkill.toLowerCase()
    const requiredLower = requiredSkill.toLowerCase()

    // Direct substring match
    if (profileLower.includes(requiredLower) || requiredLower.includes(profileLower)) {
      return true
    }

    // Check skill mappings
    for (const [category, keywords] of Object.entries(skillMappings)) {
      const categoryMatches = keywords.some(keyword => 
        profileLower.includes(keyword) || requiredLower.includes(keyword)
      )
      if (categoryMatches && (
        profileLower.includes(category.toLowerCase()) || 
        requiredLower.includes(category.toLowerCase())
      )) {
        return true
      }
    }

    return false
  }

  // Calculate interest alignment with project
  private calculateInterestAlignment(profileInterests: string[], projectCategory: string, projectDescription: string): number {
    if (profileInterests.length === 0) return 50

    let alignmentScore = 0
    const description = projectDescription.toLowerCase()
    const category = projectCategory.toLowerCase()

    for (const interest of profileInterests) {
      const interestLower = interest.toLowerCase()
      
      // Direct category match
      if (category.includes(interestLower) || interestLower.includes(category)) {
        alignmentScore += 40
      }
      
      // Description contains interest
      if (description.includes(interestLower)) {
        alignmentScore += 20
      }

      // Thematic alignment
      const thematicScore = this.calculateThematicAlignment(interest, projectCategory, projectDescription)
      alignmentScore += thematicScore
    }

    return Math.min(100, alignmentScore)
  }

  // Calculate thematic alignment between interests and project
  private calculateThematicAlignment(interest: string, category: string, description: string): number {
    const thematicMappings: { [key: string]: string[] } = {
      'Housing Justice': ['housing', 'tenant', 'affordable', 'gentrification', 'displacement'],
      'Mental Health': ['wellness', 'healing', 'trauma', 'therapy', 'support'],
      'Digital Equity': ['technology', 'digital', 'internet', 'access', 'literacy'],
      'Economic Justice': ['economic', 'wealth', 'financial', 'cooperative', 'jobs'],
      'Racial Equity': ['racial', 'justice', 'equality', 'discrimination', 'bias'],
      'Environmental Justice': ['environment', 'climate', 'sustainability', 'green', 'pollution']
    }

    const interestKeywords = thematicMappings[interest] || []
    const combinedText = `${category} ${description}`.toLowerCase()
    
    let thematicScore = 0
    for (const keyword of interestKeywords) {
      if (combinedText.includes(keyword)) {
        thematicScore += 10
      }
    }

    return Math.min(30, thematicScore)
  }

  // Check if availability matches time commitment needs
  private checkAvailabilityMatch(profileAvailability: string, requiredCommitment: string): boolean {
    const extractHours = (text: string): number => {
      const match = text.match(/(\d+)-?(\d+)?/)
      if (match) {
        return match[2] ? parseInt(match[2]) : parseInt(match[1])
      }
      return 0
    }

    const profileHours = extractHours(profileAvailability)
    const requiredHours = extractHours(requiredCommitment)

    // Consider it a match if profile availability meets 70% of required commitment
    return profileHours >= (requiredHours * 0.7)
  }

  // Check location compatibility
  private checkLocationMatch(profileLocation?: string, projectLocation?: string, remoteOk: boolean = true): boolean {
    if (remoteOk) return true
    if (!profileLocation || !projectLocation) return false

    const profileCity = profileLocation.split(',')[0].trim().toLowerCase()
    const projectCity = projectLocation.split(',')[0].trim().toLowerCase()

    return profileCity === projectCity
  }

  // Calculate experience bonus based on past successful matches
  private calculateExperienceBonus(matchHistory: SkillProfile['matchHistory']): number {
    if (matchHistory.length === 0) return 50

    const successfulMatches = matchHistory.filter(match => match.joined)
    const successRate = successfulMatches.length / matchHistory.length
    const averageScore = matchHistory.reduce((sum, match) => sum + match.matchScore, 0) / matchHistory.length

    return Math.round((successRate * 50) + (averageScore * 0.5))
  }

  // Calculate confidence in the match recommendation
  private calculateConfidenceScore(skillMatch: any, interestAlignment: number, profile: SkillProfile): number {
    let confidence = 50 // Base confidence

    // Skill verification increases confidence
    const verifiedSkills = profile.skills.filter(s => s.verified).length
    const totalSkills = profile.skills.length
    if (totalSkills > 0) {
      confidence += (verifiedSkills / totalSkills) * 20
    }

    // Strong skill match increases confidence
    if (skillMatch.overallScore >= 80) confidence += 15
    
    // Strong interest alignment increases confidence
    if (interestAlignment >= 70) confidence += 10

    // Active profile with recent engagement
    if (profile.isActive && profile.bio && profile.bio.length > 50) {
      confidence += 5
    }

    return Math.min(100, Math.round(confidence))
  }

  // Generate human-readable recommendation reasons
  private generateRecommendationReasons(skillMatch: any, interestAlignment: number, availabilityMatch: boolean, locationMatch: boolean, profile: SkillProfile): string[] {
    const reasons: string[] = []

    // Skill-based reasons
    const strongSkills = skillMatch.matches.filter((m: any) => m.scoreContribution >= 90)
    if (strongSkills.length > 0) {
      reasons.push(`Expert-level match in ${strongSkills[0].skill}`)
    }

    const verifiedSkills = profile.skills.filter(s => s.verified)
    if (verifiedSkills.length >= 2) {
      reasons.push(`${verifiedSkills.length} verified skills`)
    }

    // Interest alignment
    if (interestAlignment >= 80) {
      reasons.push('Strong passion alignment with project goals')
    }

    // Experience and background
    const experiencedSkills = profile.skills.filter(s => s.experience && s.experience.includes('years'))
    if (experiencedSkills.length > 0) {
      reasons.push('Extensive hands-on experience')
    }

    // Availability and commitment
    if (availabilityMatch) {
      reasons.push('Schedule availability matches project needs')
    }

    // Location
    if (locationMatch) {
      reasons.push('Local community member')
    }

    // Engagement indicators
    if (profile.bio && profile.bio.length > 100) {
      reasons.push('Active and engaged community member')
    }

    return reasons.slice(0, 3) // Return top 3 reasons
  }

  // Add a new skill profile to the matching pool
  public addSkillProfile(profile: Omit<SkillProfile, 'id' | 'matchHistory'>): SkillProfile {
    const newProfile: SkillProfile = {
      ...profile,
      id: `profile-${Date.now()}`,
      matchHistory: []
    }
    
    this.skillProfiles.push(newProfile)
    return newProfile
  }

  // Update match history when someone joins a project
  public recordMatchOutcome(profileId: string, projectId: string, matchScore: number, joined: boolean): void {
    const profile = this.skillProfiles.find(p => p.id === profileId)
    if (profile) {
      profile.matchHistory.push({
        projectId,
        matchScore,
        joined
      })
    }
  }

  // Get detailed analytics on matching performance
  public getMatchingAnalytics(): any {
    const totalProfiles = this.skillProfiles.length
    const activeProfiles = this.skillProfiles.filter(p => p.isActive).length
    
    const skillDistribution: { [skill: string]: number } = {}
    for (const profile of this.skillProfiles) {
      for (const skill of profile.skills) {
        skillDistribution[skill.skill] = (skillDistribution[skill.skill] || 0) + 1
      }
    }

    const topSkills = Object.entries(skillDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    return {
      totalProfiles,
      activeProfiles,
      topSkills,
      averageSkillsPerProfile: this.skillProfiles.reduce((sum, p) => sum + p.skills.length, 0) / totalProfiles,
      verificationRate: this.skillProfiles.reduce((sum, p) => sum + p.skills.filter(s => s.verified).length, 0) / 
                       this.skillProfiles.reduce((sum, p) => sum + p.skills.length, 0)
    }
  }
}

export default CollaboratorMatchingService