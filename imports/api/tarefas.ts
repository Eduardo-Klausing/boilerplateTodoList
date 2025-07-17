import { Mongo } from 'meteor/mongo';

interface Tarefa {
  _id: string;
  titulo: string;
  descricao?: string;
  situacao: 'pendente' | 'em-andamento' | 'concluida';
  dataAtualizacao: Date;
  userId: string;
}

export const TarefasCollection = new Mongo.Collection<Tarefa>('tarefas');
