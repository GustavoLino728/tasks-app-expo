import { useLocalSearchParams } from 'expo-router';
import { useTaskStore } from '../../src/store/useTasksStore';

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTaskStore((state) =>
    state.tasks.find((t) => t._id === id)
  );

  if (!task) {
    return <Text>Tarefa não encontrada</Text>;
  }

  return (
    <View>
      <Text>{task.text}</Text>
    </View>
  );
}