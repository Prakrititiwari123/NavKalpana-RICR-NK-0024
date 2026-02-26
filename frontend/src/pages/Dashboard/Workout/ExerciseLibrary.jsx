import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Heart,
  Play,
  Dumbbell,
  Target,
  TrendingUp,
  Star,
  Clock,
  Info,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';

const ExerciseLibrary = ({ 
  onSelect, 
  selected = [], 
  favorites = [],
  onToggleFavorite,
  userProfile 
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesState, setFavoritesState] = useState(favorites);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get user data from auth context
  const userHealthData = user?.healthData || {};
  const userGoals = userHealthData.goals || {};
  const experienceLevel = userGoals.experienceLevel || 'beginner';

  // Exercise database with real workout data
  const exerciseDatabase = useMemo(() => [
    // Chest Exercises
    {
      id: 1,
      name: 'Barbell Bench Press',
      muscleGroup: 'chest',
      equipment: 'barbell',
      difficulty: 'intermediate',
      description: 'Compound movement for chest, shoulders, and triceps',
      benefits: ['Builds upper body strength', 'Increases chest mass', 'Improves pushing power'],
      videoUrl: '/videos/bench-press.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Pectoralis Major'],
      secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
      instructions: [
        'Lie flat on bench with feet planted firmly on floor',
        'Grip bar slightly wider than shoulder width',
        'Lower bar to chest with control (touch chest lightly)',
        'Press back up explosively to starting position',
      ],
      tips: [
        'Keep shoulders pinched back',
        'Maintain arch in lower back',
        'Don\'t bounce bar off chest',
      ],
      commonMistakes: [
        'Bouncing bar off chest',
        'Flaring elbows too much',
        'Lifting hips off bench',
      ],
      sets: '3-4',
      reps: '8-12',
      rest: '90-120 seconds',
      caloriesPerMin: 8,
      alternativeExercises: ['Dumbbell Press', 'Push-ups', 'Machine Press'],
    },
    {
      id: 2,
      name: 'Dumbbell Chest Press',
      muscleGroup: 'chest',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      description: 'Effective chest builder with greater range of motion',
      benefits: ['Better range of motion', 'Addresses muscle imbalances', 'Safer without spotter'],
      videoUrl: '/videos/db-press.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Pectoralis Major'],
      secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
      instructions: [
        'Lie on bench with dumbbells at chest level',
        'Press dumbbells up until arms extended',
        'Lower with control to chest level',
      ],
      tips: [
        'Keep dumbbells parallel throughout',
        'Squeeze chest at top',
        'Control negative portion',
      ],
      commonMistakes: [
        'Using too much weight',
        'Arching back excessively',
        'Uneven pressing',
      ],
      sets: '3-4',
      reps: '10-15',
      rest: '60-90 seconds',
      caloriesPerMin: 7,
      alternativeExercises: ['Barbell Press', 'Push-ups', 'Cable Flyes'],
    },
    {
      id: 3,
      name: 'Push-Ups',
      muscleGroup: 'chest',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      description: 'Classic bodyweight chest exercise that can be done anywhere',
      benefits: ['No equipment needed', 'Works multiple muscles', 'Can be modified for any level'],
      videoUrl: '/videos/pushups.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Pectoralis Major'],
      secondaryMuscles: ['Triceps', 'Anterior Deltoid', 'Core'],
      instructions: [
        'Start in plank position with hands shoulder-width',
        'Lower body until chest nearly touches floor',
        'Push back up explosively',
      ],
      tips: [
        'Keep body straight throughout',
        'Engage core and glutes',
        'Full range of motion',
      ],
      commonMistakes: [
        'Sagging hips',
        'Partial reps',
        'Flaring elbows too wide',
      ],
      sets: '3-4',
      reps: '10-20',
      rest: '60 seconds',
      caloriesPerMin: 6,
      alternativeExercises: ['Incline Push-ups', 'Diamond Push-ups', 'Decline Push-ups'],
    },

    // Back Exercises
    {
      id: 4,
      name: 'Pull-Ups',
      muscleGroup: 'back',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      description: 'Compound pulling movement for back and biceps',
      benefits: ['Builds impressive back width', 'Improves grip strength', 'Functional strength'],
      videoUrl: '/videos/pullups.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Latissimus Dorsi'],
      secondaryMuscles: ['Biceps Brachii', 'Rear Deltoid', 'Rhomboids'],
      instructions: [
        'Hang from bar with overhand grip, hands shoulder-width',
        'Pull body up until chin passes the bar',
        'Lower with control to starting position',
      ],
      tips: [
        'Initiate pull with back, not arms',
        'Squeeze shoulder blades together',
        'Avoid swinging momentum',
      ],
      commonMistakes: [
        'Using momentum/kipping',
        'Partial range of motion',
        'Not engaging back',
      ],
      sets: '3-4',
      reps: '6-12',
      rest: '90-120 seconds',
      caloriesPerMin: 9,
      alternativeExercises: ['Lat Pulldowns', 'Assisted Pull-ups', 'Rows'],
    },
    {
      id: 5,
      name: 'Barbell Rows',
      muscleGroup: 'back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      description: 'Essential back thickness builder',
      benefits: ['Builds back thickness', 'Improves posture', 'Strengthens lower back'],
      videoUrl: '/videos/barbell-row.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
      secondaryMuscles: ['Biceps', 'Rear Deltoid', 'Forearms'],
      instructions: [
        'Bend forward at hips with bar hanging at knee level',
        'Pull bar to lower chest/solar plexus',
        'Lower with control, feeling stretch in lats',
      ],
      tips: [
        'Keep back straight, not rounded',
        'Pull with elbows, not arms',
        'Squeeze at top of movement',
      ],
      commonMistakes: [
        'Rounding lower back',
        'Using too much body English',
        'Pulling with arms only',
      ],
      sets: '3-4',
      reps: '8-12',
      rest: '90 seconds',
      caloriesPerMin: 8,
      alternativeExercises: ['Dumbbell Rows', 'Cable Rows', 'T-Bar Rows'],
    },
    {
      id: 6,
      name: 'Lat Pulldown',
      muscleGroup: 'back',
      equipment: 'machine',
      difficulty: 'beginner',
      description: 'Cable exercise for lat development, great for beginners',
      benefits: ['Controlled movement', 'Good for beginners', 'Isolates lats effectively'],
      videoUrl: '/videos/lat-pulldown.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Latissimus Dorsi'],
      secondaryMuscles: ['Biceps', 'Rear Deltoid', 'Rhomboids'],
      instructions: [
        'Sit at lat pulldown machine with thighs secured',
        'Pull bar down to upper chest',
        'Return to starting position slowly, feeling stretch',
      ],
      tips: [
        'Lean back slightly at peak contraction',
        'Pull bar to collarbone, not behind neck',
        'Control negative portion',
      ],
      commonMistakes: [
        'Using too much weight',
        'Pulling bar behind neck',
        'Using body momentum',
      ],
      sets: '3-4',
      reps: '10-15',
      rest: '60-90 seconds',
      caloriesPerMin: 7,
      alternativeExercises: ['Pull-ups', 'Rows', 'Straight Arm Pulldowns'],
    },

    // Legs Exercises
    {
      id: 7,
      name: 'Barbell Squats',
      muscleGroup: 'legs',
      equipment: 'barbell',
      difficulty: 'intermediate',
      description: 'King of all leg exercises, builds total lower body strength',
      benefits: ['Builds leg mass', 'Increases testosterone', 'Functional strength'],
      videoUrl: '/videos/squat.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
      secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Core'],
      instructions: [
        'Place bar on upper back (not neck)',
        'Feet shoulder-width, toes slightly out',
        'Lower until thighs parallel or below',
        'Drive through heels to stand',
      ],
      tips: [
        'Keep chest up, back straight',
        'Breathe properly (inhale down, exhale up)',
        'Knees track over toes',
      ],
      commonMistakes: [
        'Rounding lower back',
        'Knees caving inward',
        'Not going deep enough',
      ],
      sets: '3-4',
      reps: '8-12',
      rest: '120-180 seconds',
      caloriesPerMin: 10,
      alternativeExercises: ['Goblet Squats', 'Leg Press', 'Hack Squats'],
    },
    {
      id: 8,
      name: 'Leg Press',
      muscleGroup: 'legs',
      equipment: 'machine',
      difficulty: 'beginner',
      description: 'Machine-based quad and glute builder, safer for beginners',
      benefits: ['Less back strain', 'Can handle heavy weight', 'Good for isolation'],
      videoUrl: '/videos/leg-press.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
      secondaryMuscles: ['Hamstrings', 'Calves'],
      instructions: [
        'Sit in machine with feet shoulder-width on platform',
        'Lower weight until knees at 90 degrees',
        'Push through heels to return to start',
      ],
      tips: [
        'Keep back flat against pad',
        'Don\'t lock knees at top',
        'Vary foot position for different emphasis',
      ],
      commonMistakes: [
        'Going too heavy',
        'Lifting hips off seat',
        'Partial range of motion',
      ],
      sets: '3-4',
      reps: '10-15',
      rest: '90-120 seconds',
      caloriesPerMin: 8,
      alternativeExercises: ['Squats', 'Hack Squats', 'Lunges'],
    },
    {
      id: 9,
      name: 'Romanian Deadlift',
      muscleGroup: 'legs',
      equipment: 'barbell',
      difficulty: 'intermediate',
      description: 'Hamstring and glute focused deadlift variation',
      benefits: ['Great for hamstrings', 'Improves hip hinge', 'Glute activation'],
      videoUrl: '/videos/rdl.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Hamstrings', 'Gluteus Maximus'],
      secondaryMuscles: ['Erector Spinae', 'Forearms'],
      instructions: [
        'Hold bar at hip level with overhand grip',
        'Hinge at hips, keeping legs nearly straight',
        'Lower bar to mid-shin level',
        'Return to start by driving hips forward',
      ],
      tips: [
        'Maintain slight knee bend',
        'Keep back flat throughout',
        'Feel stretch in hamstrings',
      ],
      commonMistakes: [
        'Rounding back',
        'Bending knees too much',
        'Not hinging properly',
      ],
      sets: '3-4',
      reps: '8-12',
      rest: '90-120 seconds',
      caloriesPerMin: 9,
      alternativeExercises: ['Good Mornings', 'Glute Bridges', 'Hamstring Curls'],
    },

    // Shoulders Exercises
    {
      id: 10,
      name: 'Overhead Press',
      muscleGroup: 'shoulders',
      equipment: 'barbell',
      difficulty: 'intermediate',
      description: 'Primary shoulder mass builder',
      benefits: ['Builds shoulder strength', 'Improves overhead stability', 'Core engagement'],
      videoUrl: '/videos/ohp.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Anterior Deltoid'],
      secondaryMuscles: ['Lateral Deltoid', 'Triceps', 'Upper Chest'],
      instructions: [
        'Bar at shoulder level, grip slightly wider than shoulders',
        'Press overhead until arms are locked',
        'Lower to shoulder level with control',
      ],
      tips: [
        'Squeeze glutes for stability',
        'Keep bar path straight up',
        'Don\'t lean back excessively',
      ],
      commonMistakes: [
        'Arching back too much',
        'Uneven pressing',
        'Not locking out',
      ],
      sets: '3-4',
      reps: '8-12',
      rest: '90-120 seconds',
      caloriesPerMin: 8,
      alternativeExercises: ['Dumbbell Press', 'Machine Press', 'Push Press'],
    },
    {
      id: 11,
      name: 'Lateral Raises',
      muscleGroup: 'shoulders',
      equipment: 'dumbbell',
      difficulty: 'beginner',
      description: 'Side delt isolation exercise for width',
      benefits: ['Builds shoulder width', 'Improves shoulder health', 'Good for definition'],
      videoUrl: '/videos/lateral-raise.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Lateral Deltoid'],
      secondaryMuscles: ['Anterior Deltoid', 'Trapezius'],
      instructions: [
        'Hold dumbbells at sides, slight bend in elbows',
        'Raise arms to shoulder height (like pouring water)',
        'Lower with control to starting position',
      ],
      tips: [
        'Lead with elbows, not hands',
        'Keep shoulders down, not shrugged',
        'Control negative portion',
      ],
      commonMistakes: [
        'Using momentum',
        'Going too heavy',
        'Shrugging shoulders',
      ],
      sets: '3-4',
      reps: '12-15',
      rest: '60 seconds',
      caloriesPerMin: 6,
      alternativeExercises: ['Cable Lateral Raises', 'Machine Laterals', 'Upright Rows'],
    },

    // Arms Exercises
    {
      id: 12,
      name: 'Barbell Curl',
      muscleGroup: 'arms',
      equipment: 'barbell',
      difficulty: 'beginner',
      description: 'Classic bicep builder for mass and strength',
      benefits: ['Builds bicep mass', 'Improves grip strength', 'Simple and effective'],
      videoUrl: '/videos/barbell-curl.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Biceps Brachii'],
      secondaryMuscles: ['Brachialis', 'Forearms'],
      instructions: [
        'Hold bar with underhand grip, shoulder-width',
        'Curl bar up to shoulders, squeezing biceps',
        'Lower with control to starting position',
      ],
      tips: [
        'Keep elbows pinned to sides',
        'Don\'t swing momentum',
        'Squeeze hard at top',
      ],
      commonMistakes: [
        'Using body momentum',
        'Elbows moving forward',
        'Not full range of motion',
      ],
      sets: '3-4',
      reps: '10-15',
      rest: '60-90 seconds',
      caloriesPerMin: 6,
      alternativeExercises: ['Dumbbell Curls', 'Hammer Curls', 'Cable Curls'],
    },
    {
      id: 13,
      name: 'Tricep Dips',
      muscleGroup: 'arms',
      equipment: 'bodyweight',
      difficulty: 'intermediate',
      description: 'Compound tricep exercise that builds arm size',
      benefits: ['Builds tricep mass', 'Also works chest', 'Functional strength'],
      videoUrl: '/videos/dips.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Triceps Brachii'],
      secondaryMuscles: ['Pectoralis Major', 'Anterior Deltoid'],
      instructions: [
        'Support body on parallel bars',
        'Lower until elbows at 90 degrees',
        'Push back up to starting position',
      ],
      tips: [
        'Keep body upright for tricep focus',
        'Lean forward to emphasize chest',
        'Control the movement',
      ],
      commonMistakes: [
        'Going too low (shoulder strain)',
        'Not full range of motion',
        'Using momentum',
      ],
      sets: '3-4',
      reps: '8-15',
      rest: '90 seconds',
      caloriesPerMin: 8,
      alternativeExercises: ['Bench Dips', 'Tricep Pushdowns', 'Close-grip Press'],
    },

    // Core Exercises
    {
      id: 14,
      name: 'Plank',
      muscleGroup: 'core',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      description: 'Isometric core strengthener',
      benefits: ['Builds core endurance', 'Improves posture', 'No equipment needed'],
      videoUrl: '/videos/plank.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
      secondaryMuscles: ['Erector Spinae', 'Shoulders'],
      instructions: [
        'Lie face down, then lift onto forearms and toes',
        'Keep body in straight line from head to heels',
        'Hold position for desired time',
      ],
      tips: [
        'Squeeze glutes and core',
        'Don\'t let hips sag',
        'Breathe steadily',
      ],
      commonMistakes: [
        'Sagging hips',
        'Holding breath',
        'Looking up (neck strain)',
      ],
      sets: '3-4',
      reps: '30-60 seconds',
      rest: '45 seconds',
      caloriesPerMin: 4,
      alternativeExercises: ['Side Plank', 'Dead Bug', 'Bird Dog'],
    },
    {
      id: 15,
      name: 'Russian Twists',
      muscleGroup: 'core',
      equipment: 'bodyweight',
      difficulty: 'beginner',
      description: 'Rotational core exercise for obliques',
      benefits: ['Targets obliques', 'Improves rotational strength', 'Can add weight'],
      videoUrl: '/videos/russian-twist.mp4',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-9999004b45c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      primaryMuscles: ['External Obliques', 'Internal Obliques'],
      secondaryMuscles: ['Rectus Abdominis', 'Hip Flexors'],
      instructions: [
        'Sit with knees bent, lean back slightly',
        'Rotate torso side to side, touching floor each side',
        'Keep core engaged throughout',
      ],
      tips: [
        'Lift feet for added difficulty',
        'Move with control',
        'Breathe rhythmically',
      ],
      commonMistakes: [
        'Using momentum',
        'Not rotating fully',
        'Holding breath',
      ],
      sets: '3-4',
      reps: '15-20 each side',
      rest: '45 seconds',
      caloriesPerMin: 5,
      alternativeExercises: ['Bicycle Crunches', 'Woodchoppers', 'Cable Rotations'],
    },
  ], []);

  const muscleGroups = [
    { value: 'all', label: 'All Muscles', icon: '💪' },
    { value: 'chest', label: 'Chest', icon: '🫀' },
    { value: 'back', label: 'Back', icon: '🔙' },
    { value: 'legs', label: 'Legs', icon: '🦵' },
    { value: 'shoulders', label: 'Shoulders', icon: '👔' },
    { value: 'arms', label: 'Arms', icon: '💪' },
    { value: 'core', label: 'Core', icon: '🎯' },
  ];

  const equipmentTypes = [
    { value: 'all', label: 'All Equipment' },
    { value: 'barbell', label: 'Barbell' },
    { value: 'dumbbell', label: 'Dumbbell' },
    { value: 'machine', label: 'Machine' },
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'cable', label: 'Cable' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const toggleFavorite = (exerciseId) => {
    setFavoritesState((prev) => {
      const newFavorites = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];
      
      if (onToggleFavorite) {
        onToggleFavorite(exerciseId);
      }
      
      return newFavorites;
    });
  };

  // Filtered exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exerciseDatabase.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMuscle =
        selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;

      const matchesEquipment =
        selectedEquipment === 'all' || exercise.equipment === selectedEquipment;

      const matchesDifficulty =
        selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;

      const matchesFavorites =
        !showFavoritesOnly || favoritesState.includes(exercise.id);

      return (
        matchesSearch &&
        matchesMuscle &&
        matchesEquipment &&
        matchesDifficulty &&
        matchesFavorites
      );
    });
  }, [
    searchQuery,
    selectedMuscleGroup,
    selectedEquipment,
    selectedDifficulty,
    showFavoritesOnly,
    favoritesState,
    exerciseDatabase,
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEquipmentIcon = (equipment) => {
    switch (equipment) {
      case 'barbell':
        return '🏋️';
      case 'dumbbell':
        return '🏋️‍♂️';
      case 'machine':
        return '⚙️';
      case 'bodyweight':
        return '🧘';
      case 'cable':
        return '🪢';
      default:
        return '💪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises by name, muscle, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
              showFavoritesOnly
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Heart className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
          >
            {/* Muscle Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Muscle Group
              </label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {muscleGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.icon} {group.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Dumbbell className="w-4 h-4 inline mr-1" />
                Equipment
              </label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {equipmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {getEquipmentIcon(type.value)} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredExercises.length} exercise
            {filteredExercises.length !== 1 ? 's' : ''}
          </div>
          {experienceLevel && (
            <div className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              Recommended for {experienceLevel}
            </div>
          )}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all ${
                selected.includes(exercise.id)
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Exercise Image */}
              <div 
                className="relative h-48 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${exercise.imageUrl})` }}
                onClick={() => {
                  setSelectedExercise(exercise);
                  setShowDetails(true);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600 ml-1" />
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(exercise.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoritesState.includes(exercise.id)
                        ? 'fill-pink-600 text-pink-600'
                        : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Difficulty Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Exercise Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <span>{getEquipmentIcon(exercise.equipment)} {exercise.equipment}</span>
                    <span>•</span>
                    <span>{exercise.primaryMuscles[0]}</span>
                  </div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <span className="text-xs text-gray-500">Sets</span>
                    <p className="font-semibold text-gray-800">{exercise.sets}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <span className="text-xs text-gray-500">Reps</span>
                    <p className="font-semibold text-gray-800">{exercise.reps}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <span className="text-xs text-gray-500">Rest</span>
                    <p className="font-semibold text-gray-800 text-xs">{exercise.rest}</p>
                  </div>
                </div>

                {/* Muscle Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                    <span key={muscle} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {muscle}
                    </span>
                  ))}
                  {exercise.secondaryMuscles.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{exercise.secondaryMuscles.length} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedExercise(exercise);
                      setShowDetails(true);
                    }}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                  <button
                    onClick={() => onSelect && onSelect(exercise)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 ${
                      selected.includes(exercise.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {selected.includes(exercise.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        Select
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl"
        >
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No exercises found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMuscleGroup('all');
              setSelectedEquipment('all');
              setSelectedDifficulty('all');
              setShowFavoritesOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {showDetails && selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${selectedExercise.imageUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white">{selectedExercise.name}</h2>
                  <p className="text-white/90 mt-1">{selectedExercise.description}</p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Target className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-500">Primary</p>
                    <p className="font-medium text-gray-800">{selectedExercise.primaryMuscles[0]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Dumbbell className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                    <p className="text-xs text-gray-500">Equipment</p>
                    <p className="font-medium text-gray-800 capitalize">{selectedExercise.equipment}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className="font-medium text-gray-800 capitalize">{selectedExercise.difficulty}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Instructions</h3>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips & Common Mistakes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-1">
                      {selectedExercise.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span>•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Common Mistakes
                    </h3>
                    <ul className="space-y-1">
                      {selectedExercise.commonMistakes.map((mistake, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <span>•</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Muscles Worked */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Muscles Worked</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-2">Primary</p>
                      {selectedExercise.primaryMuscles.map((muscle) => (
                        <div key={muscle} className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{muscle}</span>
                            <span className="text-blue-600">100%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-2">Secondary</p>
                      {selectedExercise.secondaryMuscles.map((muscle) => (
                        <div key={muscle} className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{muscle}</span>
                            <span className="text-purple-600">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '60%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alternative Exercises */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Alternative Exercises</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExercise.alternativeExercises.map((alt) => (
                      <div key={alt} className="bg-gray-50 rounded-lg p-2 text-sm text-gray-700">
                        {alt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      onSelect && onSelect(selectedExercise);
                      setShowDetails(false);
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add to Workout
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedExercise.id)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Heart className={`w-5 h-5 ${favoritesState.includes(selectedExercise.id) ? 'fill-pink-600 text-pink-600' : ''}`} />
                    {favoritesState.includes(selectedExercise.id) ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseLibrary;