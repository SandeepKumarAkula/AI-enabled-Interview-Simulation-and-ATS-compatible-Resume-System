/**
 * ATS AGENT CONFIGURATION
 * Centralized configuration for all ATS agents
 * Load from environment variables with fallback defaults
 */

export interface AgentConfig {
  // Agent versioning
  version: string
  agentType: 'custom' | 'intelligent' | 'rl'
  
  // Neural network architecture
  neuralNetwork?: {
    inputSize: number
    hiddenLayers: number[]
    outputSize: number
    activationFunction: 'relu' | 'sigmoid' | 'tanh'
  }
  
  // Learning parameters
  learningRate: number
  initialLearningRate: number
  discountFactor: number
  explorationRate: number
  momentum: number
  l2Regularization: number
  
  // Decision thresholds
  decisionThresholds: {
    hire: number
    consider: number
    reject: number
  }
  
  // Feature weights
  featureWeights: {
    technical: number
    experience: number
    communication: number
    culture: number
    education: number
    leadership: number
    impact: number
    innovation: number
    softSkills: number
    quality: number
  }
  
  // Penalty multipliers
  penalties: {
    weakTechnical: number
    veryJunior: number
    poorCommunication: number
  }
  
  // Industry-specific weights
  industryWeights: Record<string, {
    techWeights: Record<string, number>
    softSkillWeights: Record<string, number>
    experienceWeighting: Record<string, number>
    complianceRules: string[]
  }>
  
  // Q-Learning defaults
  qLearning?: {
    defaultQValues: {
      hire: number
      reject: number
      consider: number
    }
    stateSpace: number
    actionSpace: number
  }
  
  // Training configuration
  training: {
    leniencyPercent: number
    complianceMode: boolean
    maxHistorySize: number
    batchSize: number
    epochs: number
  }
  
  // Data and metrics
  pretrainingExamples: number
  accuracy: number
}

/**
 * Load configuration from environment variables
 */
export function loadAgentConfig(agentType: 'custom' | 'intelligent' | 'rl'): AgentConfig {
  const leniency = parseFloat(process.env.ATS_LENIENCY_PERCENT || '10')
  const learningRate = parseFloat(process.env.AGENT_LEARNING_RATE || getDefaultLearningRate(agentType))
  const discountFactor = parseFloat(process.env.AGENT_DISCOUNT_FACTOR || '0.95')
  const explorationRate = parseFloat(process.env.AGENT_EXPLORATION_RATE || '0.05')
  
  const config: AgentConfig = {
    version: getVersionForAgent(agentType),
    agentType,
    
    learningRate,
    initialLearningRate: learningRate,
    discountFactor,
    explorationRate,
    momentum: parseFloat(process.env.AGENT_MOMENTUM || '0.9'),
    l2Regularization: parseFloat(process.env.AGENT_L2_REG || '0.0001'),
    
    decisionThresholds: {
      hire: parseFloat(process.env.HIRE_THRESHOLD || '0.75'),
      consider: parseFloat(process.env.CONSIDER_THRESHOLD || '0.55'),
      reject: parseFloat(process.env.REJECT_THRESHOLD || '0.35')
    },
    
    featureWeights: {
      technical: parseFloat(process.env.WEIGHT_TECHNICAL || '0.15'),
      experience: parseFloat(process.env.WEIGHT_EXPERIENCE || '0.11'),
      communication: parseFloat(process.env.WEIGHT_COMMUNICATION || '0.10'),
      culture: parseFloat(process.env.WEIGHT_CULTURE || '0.08'),
      education: parseFloat(process.env.WEIGHT_EDUCATION || '0.06'),
      leadership: parseFloat(process.env.WEIGHT_LEADERSHIP || '0.04'),
      impact: parseFloat(process.env.WEIGHT_IMPACT || '0.13'),
      innovation: parseFloat(process.env.WEIGHT_INNOVATION || '0.12'),
      softSkills: parseFloat(process.env.WEIGHT_SOFT_SKILLS || '0.11'),
      quality: parseFloat(process.env.WEIGHT_QUALITY || '0.10')
    },
    
    penalties: {
      weakTechnical: parseFloat(process.env.PENALTY_WEAK_TECH || '0.8'),
      veryJunior: parseFloat(process.env.PENALTY_JUNIOR || '0.85'),
      poorCommunication: parseFloat(process.env.PENALTY_POOR_COMM || '0.9')
    },
    
    industryWeights: getIndustryWeights(),
    
    training: {
      leniencyPercent: leniency,
      complianceMode: process.env.COMPLIANCE_MODE !== 'false',
      maxHistorySize: parseInt(process.env.MAX_HISTORY_SIZE || '1000'),
      batchSize: parseInt(process.env.BATCH_SIZE || '256'),
      epochs: parseInt(process.env.TRAINING_EPOCHS || '100')
    },
    
    pretrainingExamples: parseInt(process.env.PRETRAINING_EXAMPLES || '50000000'),
    accuracy: parseFloat(process.env.MODEL_ACCURACY || '0.96')
  }
  
  // Add neural network config for intelligent agent
  if (agentType === 'intelligent') {
    config.neuralNetwork = {
      inputSize: parseInt(process.env.NN_INPUT_SIZE || '12'),
      hiddenLayers: (process.env.NN_HIDDEN_LAYERS || '32,24,16').split(',').map(Number),
      outputSize: 1,
      activationFunction: (process.env.NN_ACTIVATION || 'relu') as 'relu' | 'sigmoid' | 'tanh'
    }
  }
  
  // Add Q-Learning config for RL agent
  if (agentType === 'rl') {
    config.qLearning = {
      defaultQValues: {
        hire: parseFloat(process.env.Q_DEFAULT_HIRE || '0.5'),
        reject: parseFloat(process.env.Q_DEFAULT_REJECT || '0.3'),
        consider: parseFloat(process.env.Q_DEFAULT_CONSIDER || '0.4')
      },
      stateSpace: parseInt(process.env.Q_STATE_SPACE || '1771561'),
      actionSpace: 3
    }
  }
  
  return config
}

/**
 * Get default learning rate based on agent type
 */
function getDefaultLearningRate(agentType: string): string {
  switch (agentType) {
    case 'custom':
      return '0.001'
    case 'intelligent':
      return '0.001'
    case 'rl':
      return '0.15'
    default:
      return '0.01'
  }
}

/**
 * Get version for agent type
 */
function getVersionForAgent(agentType: string): string {
  switch (agentType) {
    case 'custom':
      return process.env.AGENT_VERSION || '3.0.0-ml'
    case 'intelligent':
      return process.env.AGENT_VERSION || '4.0.0-deep-learning'
    case 'rl':
      return process.env.AGENT_VERSION || '5.0.0-q-learning'
    default:
      return '1.0.0'
  }
}

/**
 * Load industry-specific weights from environment or use defaults
 */
function getIndustryWeights(): Record<string, any> {
  const defaultWeights = {
    technology: {
      techWeights: {
        programming_languages: 28,
        frameworks_libraries: 24,
        cloud_platforms: 22,
        system_design: 20,
        databases: 18,
        devops_cicd: 19,
        ai_ml_experience: 25,
        cybersecurity: 17
      },
      softSkillWeights: {
        problem_solving: 18,
        communication: 16,
        collaboration: 14,
        adaptability: 12,
        leadership: 15,
        innovation: 13
      },
      experienceWeighting: {
        entry: 1.0,
        mid: 1.65,
        senior: 2.3,
        executive: 3.2
      },
      complianceRules: ['no_age_bias', 'no_gender_bias', 'disability_friendly', 'gdpr_compliant']
    },
    finance: {
      techWeights: {
        financial_modeling: 26,
        data_analysis: 28,
        regulatory_compliance: 24,
        risk_management: 25,
        quantitative_analysis: 27,
        fintech_platforms: 20
      },
      softSkillWeights: {
        attention_to_detail: 19,
        analytical_thinking: 18,
        integrity: 16,
        communication: 14,
        risk_assessment: 15
      },
      experienceWeighting: {
        entry: 1.0,
        mid: 1.8,
        senior: 2.5,
        executive: 3.5
      },
      complianceRules: ['sox_compliant', 'sec_regulations', 'kyc_aml_knowledge']
    },
    healthcare: {
      techWeights: {
        medical_knowledge: 30,
        healthcare_it: 20,
        electronic_health_records: 18,
        hipaa_compliance: 25,
        telemedicine: 19
      },
      softSkillWeights: {
        empathy: 18,
        attention_to_detail: 17,
        communication: 16,
        ethics: 15,
        crisis_management: 14
      },
      experienceWeighting: {
        entry: 1.0,
        mid: 1.7,
        senior: 2.4,
        executive: 3.3
      },
      complianceRules: ['hipaa_compliant', 'patient_privacy', 'medical_ethics']
    }
  }
  
  return defaultWeights
}

/**
 * Validate configuration
 */
export function validateConfig(config: AgentConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validate learning rate
  if (config.learningRate <= 0 || config.learningRate > 1) {
    errors.push('Learning rate must be between 0 and 1')
  }
  
  // Validate discount factor
  if (config.discountFactor < 0 || config.discountFactor > 1) {
    errors.push('Discount factor must be between 0 and 1')
  }
  
  // Validate exploration rate
  if (config.explorationRate < 0 || config.explorationRate > 1) {
    errors.push('Exploration rate must be between 0 and 1')
  }
  
  // Validate thresholds
  const { hire, consider, reject } = config.decisionThresholds
  if (reject >= consider || consider >= hire) {
    errors.push('Decision thresholds must be in order: reject < consider < hire')
  }
  
  // Validate accuracy
  if (config.accuracy <= 0 || config.accuracy > 1) {
    errors.push('Accuracy must be between 0 and 1')
  }
  
  // Validate feature weights sum
  const weightSum = Object.values(config.featureWeights).reduce((a, b) => a + b, 0)
  if (Math.abs(weightSum - 1.0) > 0.01) {
    errors.push(`Feature weights must sum to 1.0, got ${weightSum}`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Export singleton config instances
let customConfig: AgentConfig | null = null
let intelligentConfig: AgentConfig | null = null
let rlConfig: AgentConfig | null = null

export function getCustomAgentConfig(): AgentConfig {
  if (!customConfig) {
    customConfig = loadAgentConfig('custom')
    const validation = validateConfig(customConfig)
    if (!validation.valid) {
      console.warn('Custom agent config validation errors:', validation.errors)
    }
  }
  return customConfig
}

export function getIntelligentAgentConfig(): AgentConfig {
  if (!intelligentConfig) {
    intelligentConfig = loadAgentConfig('intelligent')
    const validation = validateConfig(intelligentConfig)
    if (!validation.valid) {
      console.warn('Intelligent agent config validation errors:', validation.errors)
    }
  }
  return intelligentConfig
}

export function getRLAgentConfig(): AgentConfig {
  if (!rlConfig) {
    rlConfig = loadAgentConfig('rl')
    const validation = validateConfig(rlConfig)
    if (!validation.valid) {
      console.warn('RL agent config validation errors:', validation.errors)
    }
  }
  return rlConfig
}

/**
 * Reset singleton configs (useful for testing)
 */
export function resetConfigs(): void {
  customConfig = null
  intelligentConfig = null
  rlConfig = null
}
