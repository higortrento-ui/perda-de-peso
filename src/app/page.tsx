"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Scale, 
  Target, 
  TrendingDown, 
  Calendar, 
  Apple, 
  Dumbbell, 
  Clock, 
  CheckCircle,
  Plus,
  Minus,
  Calculator,
  Trophy,
  Activity,
  Heart,
  Flame
} from "lucide-react"

interface WeightEntry {
  date: string
  weight: number
}

interface Exercise {
  id: string
  name: string
  duration: number
  calories: number
  completed: boolean
}

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  completed: boolean
}

export default function WeightLossApp() {
  // Estados principais
  const [currentWeight, setCurrentWeight] = useState<number>(70)
  const [targetWeight, setTargetWeight] = useState<number>(65)
  const [height, setHeight] = useState<number>(170)
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { date: "2024-01-01", weight: 75 },
    { date: "2024-01-15", weight: 73 },
    { date: "2024-02-01", weight: 71 },
    { date: "2024-02-15", weight: 70 }
  ])
  
  const [dailyCaloriesGoal] = useState(1800)
  const [consumedCalories, setConsumedCalories] = useState(1200)
  const [burnedCalories, setBurnedCalories] = useState(350)
  
  // Exercícios do dia
  const [todayExercises, setTodayExercises] = useState<Exercise[]>([
    { id: "1", name: "Polichinelos", duration: 10, calories: 80, completed: false },
    { id: "2", name: "Flexões", duration: 5, calories: 40, completed: false },
    { id: "3", name: "Agachamentos", duration: 8, calories: 60, completed: false },
    { id: "4", name: "Prancha", duration: 3, calories: 25, completed: false },
    { id: "5", name: "Burpees", duration: 5, calories: 70, completed: false },
    { id: "6", name: "Mountain Climbers", duration: 8, calories: 65, completed: false }
  ])
  
  // Refeições do dia
  const [todayMeals, setTodayMeals] = useState<Meal[]>([
    { id: "1", name: "Café da Manhã - Aveia com frutas", calories: 350, protein: 12, carbs: 45, fat: 8, completed: false },
    { id: "2", name: "Lanche - Iogurte natural", calories: 120, protein: 10, carbs: 15, fat: 3, completed: false },
    { id: "3", name: "Almoço - Frango grelhado com salada", calories: 450, protein: 35, carbs: 20, fat: 15, completed: false },
    { id: "4", name: "Lanche - Maçã com amendoim", calories: 180, protein: 6, carbs: 20, fat: 8, completed: false },
    { id: "5", name: "Jantar - Peixe com legumes", calories: 380, protein: 30, carbs: 25, fat: 12, completed: false }
  ])

  // Cálculos
  const bmi = (currentWeight / ((height / 100) ** 2)).toFixed(1)
  const weightLoss = weightHistory.length > 0 ? weightHistory[0].weight - currentWeight : 0
  const progressPercentage = Math.max(0, Math.min(100, ((weightHistory[0]?.weight - currentWeight) / (weightHistory[0]?.weight - targetWeight)) * 100))
  const caloriesRemaining = dailyCaloriesGoal - consumedCalories + burnedCalories
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Abaixo do peso", color: "bg-blue-500" }
    if (bmi < 25) return { text: "Peso normal", color: "bg-green-500" }
    if (bmi < 30) return { text: "Sobrepeso", color: "bg-yellow-500" }
    return { text: "Obesidade", color: "bg-red-500" }
  }

  const toggleExercise = (id: string) => {
    setTodayExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ))
    
    const exercise = todayExercises.find(ex => ex.id === id)
    if (exercise && !exercise.completed) {
      setBurnedCalories(prev => prev + exercise.calories)
    } else if (exercise && exercise.completed) {
      setBurnedCalories(prev => prev - exercise.calories)
    }
  }

  const toggleMeal = (id: string) => {
    setTodayMeals(prev => prev.map(meal => 
      meal.id === id ? { ...meal, completed: !meal.completed } : meal
    ))
    
    const meal = todayMeals.find(m => m.id === id)
    if (meal && !meal.completed) {
      setConsumedCalories(prev => prev + meal.calories)
    } else if (meal && meal.completed) {
      setConsumedCalories(prev => prev - meal.calories)
    }
  }

  const addWeightEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    setWeightHistory(prev => [{ date: today, weight: currentWeight }, ...prev.slice(0, 9)])
  }

  const completedExercises = todayExercises.filter(ex => ex.completed).length
  const completedMeals = todayMeals.filter(meal => meal.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            FitHome - Seu App de Perda de Peso
          </h1>
          <p className="text-muted-foreground text-lg">
            Emagreça em casa com dietas personalizadas e exercícios eficazes
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Peso Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentWeight} kg</div>
              <p className="text-green-100 text-sm">
                IMC: {bmi} - {getBMICategory(parseFloat(bmi)).text}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Meta de Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{targetWeight} kg</div>
              <p className="text-blue-100 text-sm">
                Faltam {(currentWeight - targetWeight).toFixed(1)} kg
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weightLoss.toFixed(1)} kg</div>
              <p className="text-purple-100 text-sm">
                {progressPercentage.toFixed(0)}% da meta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Calorias Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caloriesRemaining}</div>
              <p className="text-orange-100 text-sm">
                Restantes para hoje
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="exercises">Exercícios</TabsTrigger>
            <TabsTrigger value="diet">Dieta</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso do Dia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Progresso de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Exercícios Concluídos</span>
                      <span>{completedExercises}/{todayExercises.length}</span>
                    </div>
                    <Progress value={(completedExercises / todayExercises.length) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Refeições Concluídas</span>
                      <span>{completedMeals}/{todayMeals.length}</span>
                    </div>
                    <Progress value={(completedMeals / todayMeals.length) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Meta de Peso</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Balanço Calórico */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Balanço Calórico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{dailyCaloriesGoal}</div>
                      <div className="text-sm text-muted-foreground">Meta</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{consumedCalories}</div>
                      <div className="text-sm text-muted-foreground">Consumidas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{burnedCalories}</div>
                      <div className="text-sm text-muted-foreground">Queimadas</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${caloriesRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {caloriesRemaining}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Calorias {caloriesRemaining > 0 ? 'restantes' : 'excedidas'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Próximas Atividades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    Próximos Exercícios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayExercises.slice(0, 3).map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${exercise.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={exercise.completed ? 'line-through text-muted-foreground' : ''}>
                            {exercise.name}
                          </span>
                        </div>
                        <Badge variant="secondary">{exercise.calories} cal</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Próximas Refeições
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayMeals.slice(0, 3).map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${meal.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={meal.completed ? 'line-through text-muted-foreground' : ''}>
                            {meal.name}
                          </span>
                        </div>
                        <Badge variant="secondary">{meal.calories} cal</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exercícios */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Exercícios Caseiros - Hoje
                </CardTitle>
                <CardDescription>
                  Exercícios que você pode fazer em casa sem equipamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {todayExercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-4">
                        <Button
                          variant={exercise.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleExercise(exercise.id)}
                          className={exercise.completed ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <div>
                          <h3 className={`font-medium ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {exercise.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exercise.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {exercise.calories} cal
                            </span>
                          </div>
                        </div>
                      </div>
                      {exercise.completed && (
                        <Badge className="bg-green-600">Concluído</Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Total de Calorias Queimadas</h3>
                      <p className="text-sm text-muted-foreground">
                        {completedExercises} de {todayExercises.length} exercícios concluídos
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {burnedCalories} cal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dieta */}
          <TabsContent value="diet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Plano Alimentar - Hoje
                </CardTitle>
                <CardDescription>
                  Refeições balanceadas para sua meta de perda de peso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {todayMeals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-4">
                        <Button
                          variant={meal.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMeal(meal.id)}
                          className={meal.completed ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <h3 className={`font-medium ${meal.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {meal.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{meal.calories} cal</span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>G: {meal.fat}g</span>
                          </div>
                        </div>
                      </div>
                      {meal.completed && (
                        <Badge className="bg-green-600">Consumido</Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{consumedCalories}</div>
                      <div className="text-sm text-muted-foreground">Calorias</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {todayMeals.filter(m => m.completed).reduce((sum, m) => sum + m.protein, 0)}g
                      </div>
                      <div className="text-sm text-muted-foreground">Proteína</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {todayMeals.filter(m => m.completed).reduce((sum, m) => sum + m.carbs, 0)}g
                      </div>
                      <div className="text-sm text-muted-foreground">Carboidratos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {todayMeals.filter(m => m.completed).reduce((sum, m) => sum + m.fat, 0)}g
                      </div>
                      <div className="text-sm text-muted-foreground">Gorduras</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progresso */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Registrar Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="weight">Peso atual (kg):</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeight(prev => Math.max(30, prev - 0.1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="weight"
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                        className="w-20 text-center"
                        step="0.1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeight(prev => prev + 0.1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={addWeightEntry} className="w-full">
                    Registrar Peso de Hoje
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Primeira Semana</div>
                      <div className="text-sm text-muted-foreground">Completou 7 dias consecutivos</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Queimador de Calorias</div>
                      <div className="text-sm text-muted-foreground">Queimou 1000+ calorias</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Vida Saudável</div>
                      <div className="text-sm text-muted-foreground">30 dias de alimentação balanceada</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Histórico de Peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weightHistory.map((entry, index) => (
                    <div key={entry.date} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.weight} kg</span>
                        {index < weightHistory.length - 1 && (
                          <Badge variant={entry.weight < weightHistory[index + 1].weight ? "default" : "secondary"}>
                            {entry.weight < weightHistory[index + 1].weight ? "↓" : "↑"}
                            {Math.abs(entry.weight - weightHistory[index + 1].weight).toFixed(1)} kg
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculadora */}
          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Calculadora IMC
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm):</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      placeholder="170"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-weight">Peso atual (kg):</Label>
                    <Input
                      id="current-weight"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                      placeholder="70"
                    />
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <div className="text-3xl font-bold mb-2">{bmi}</div>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getBMICategory(parseFloat(bmi)).color}`} />
                      <span>{getBMICategory(parseFloat(bmi)).text}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Meta de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-weight">Peso desejado (kg):</Label>
                    <Input
                      id="target-weight"
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                      placeholder="65"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {(currentWeight - targetWeight).toFixed(1)} kg
                        </div>
                        <div className="text-sm text-muted-foreground">Para perder</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {Math.ceil((currentWeight - targetWeight) / 0.5)} semanas
                        </div>
                        <div className="text-sm text-muted-foreground">Tempo estimado (0.5kg/semana)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dicas para Perda de Peso Saudável</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-green-600">✅ Faça</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Beba 2-3 litros de água por dia</li>
                      <li>• Faça exercícios regularmente</li>
                      <li>• Coma mais proteínas e fibras</li>
                      <li>• Durma 7-8 horas por noite</li>
                      <li>• Registre seu progresso</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-red-600">❌ Evite</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Dietas muito restritivas</li>
                      <li>• Pular refeições</li>
                      <li>• Alimentos ultraprocessados</li>
                      <li>• Bebidas açucaradas</li>
                      <li>• Sedentarismo</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}