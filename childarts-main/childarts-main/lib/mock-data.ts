export interface EmotionResult {
  emotion: string
  confidence: number
  secondaryEmotions: string[]
}

export interface StressIndicator {
  name: string
  detected: boolean
  description: string
}

export interface ColorAnalysis {
  dominantColors: string[]
  colorMood: string
}

export interface PlacementAnalysis {
  figurePosition: string
  spacing: string
  interpretation: string
}

export interface AnalysisResult {
  primaryEmotion: EmotionResult
  stressIndicators: StressIndicator[]
  colorAnalysis: ColorAnalysis
  placementAnalysis: PlacementAnalysis
  recommendations: string[]
}

export const mockAnalysisResult: AnalysisResult = {
  primaryEmotion: {
    emotion: "Anxious",
    confidence: 78,
    secondaryEmotions: ["Sad", "Worried"],
  },
  stressIndicators: [
    {
      name: "Heavy Shading",
      detected: true,
      description: "Excessive dark shading in figures",
    },
    {
      name: "Tiny Figures",
      detected: true,
      description: "Figures occupy less than 25% of page",
    },
    {
      name: "Missing Features",
      detected: false,
      description: "All facial features present",
    },
    {
      name: "Unusual Colors",
      detected: true,
      description: "Dark colors used for sunny scene",
    },
    {
      name: "Crossed-out Elements",
      detected: false,
      description: "No crossed-out or scribbled-over elements found",
    },
    {
      name: "Repeated Erasing",
      detected: true,
      description: "Evidence of multiple erasures and redraws",
    },
  ],
  colorAnalysis: {
    dominantColors: ["Dark Blue", "Black", "Gray"],
    colorMood: "Subdued / Dark",
  },
  placementAnalysis: {
    figurePosition: "Bottom-left corner",
    spacing: "Crowded elements",
    interpretation: "May indicate insecurity or withdrawal",
  },
  recommendations: [
    "Create a calm, quiet space for drawing at home",
    "Ask open-ended questions about the drawing without judgment",
    "Consider speaking with a school counselor about your observations",
    "Encourage your child to draw daily as a healthy emotional outlet",
    "Monitor for changes in behavior alongside drawing patterns",
  ],
}

export async function analyzeDrawing(): Promise<AnalysisResult> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return mockAnalysisResult
}

export const educationalResources = [
  {
    title: "Art Therapy for Children: A Guide for Parents",
    description:
      "Learn how creative expression can help children process complex emotions and build resilience through guided art activities.",
    category: "Art Therapy",
  },
  {
    title: "Recognizing Stress in Children by Age Group",
    description:
      "Understand the different ways stress manifests in toddlers, school-age children, and teenagers, and how their art reflects these differences.",
    category: "Child Psychology",
  },
  {
    title: "Talking to Your Child About Emotions",
    description:
      "Practical strategies for opening conversations with your child about their feelings using their artwork as a starting point.",
    category: "Communication",
  },
  {
    title: "When to Seek Professional Help",
    description:
      "Guidelines for understanding when a child's behavior or artwork may indicate the need for professional mental health support.",
    category: "Professional Guidance",
  },
  {
    title: "Creating a Safe Space for Creative Expression",
    description:
      "Tips for setting up an environment at home that encourages free artistic expression and emotional processing.",
    category: "Activities",
  },
  {
    title: "Understanding Color Choices in Children's Art",
    description:
      "An overview of what different color preferences and patterns may suggest about a child's emotional state.",
    category: "Art Therapy",
  },
]

export const interpretationGuide = [
  {
    title: "What Does Heavy Shading Mean?",
    content:
      "Heavy shading or pressing hard on the paper can sometimes indicate anxiety, frustration, or intense emotions. Children may unconsciously apply more pressure when feeling overwhelmed. However, this can also simply reflect a preference for bold artwork or the medium being used.",
    ageConsideration:
      "Common in children ages 5-8 who are still developing fine motor control. More significant if observed in older children who previously used lighter strokes.",
  },
  {
    title: "Why Are the Figures So Small?",
    content:
      "Small or tiny figures relative to the page size may suggest feelings of inadequacy, low self-esteem, or withdrawal. The child may feel small in their world or be trying to take up less space. It can also indicate shyness or introversion.",
    ageConsideration:
      "Very young children (3-5) naturally draw small figures as their spatial awareness develops. This indicator is more relevant for children ages 6 and older.",
  },
  {
    title: "What Do Dark Colors Indicate?",
    content:
      "While dark colors alone are not cause for concern, a predominant use of blacks, dark blues, and grays - especially when the subject matter would typically call for brighter colors - may reflect sadness, fear, or emotional distress.",
    ageConsideration:
      "Some children simply prefer certain colors. Look for changes in color preference over time rather than a single instance.",
  },
  {
    title: "Missing Body Parts or Features",
    content:
      "When children consistently omit important features (hands, mouth, eyes) from human figures, it may reflect feelings of powerlessness or difficulty communicating. However, younger children naturally omit details as they develop.",
    ageConsideration:
      "Children under 5 commonly omit features. By age 7-8, most children include basic facial features and body parts. Missing features after this age may warrant attention.",
  },
  {
    title: "Placement on the Page",
    content:
      "Where a child places their drawing on the page can offer insights. Bottom-left placement may suggest withdrawal or insecurity. Centered drawings often indicate good self-esteem. Drawings pushed to the edges may suggest feeling marginalized.",
    ageConsideration:
      "Placement analysis is most relevant for children ages 6 and older who have developed spatial awareness and conscious compositional choices.",
  },
]
