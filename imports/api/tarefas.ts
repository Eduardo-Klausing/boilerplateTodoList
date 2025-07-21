import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';


interface Tarefa {
  _id: string;
  titulo: string;
  descricao?: string;
  situacao: 'pendente' | 'em-andamento' | 'concluida';
  dataAtualizacao: Date;
  userId: string;
}

export const TarefasCollection = new Mongo.Collection<Tarefa>('tarefas');

// Definição da interface para os dados do formulário
interface TarefaData {
  titulo: string;
  descricao?: string;
  situacao: 'pendente' | 'em-andamento' | 'concluida';
}

// Métodos 
Meteor.methods({
  'tarefas.inserir': async function(tarefaData: TarefaData) {
  check(tarefaData, {
    titulo: String,
    descricao: Match.Maybe(String),
    situacao: String
  });

  if (!this.userId) {
    throw new Meteor.Error('not-authorized', 'Usuário não autenticado');
  }

  const agora = new Date();

  return await TarefasCollection.insertAsync({
    titulo: tarefaData.titulo,
    descricao: tarefaData.descricao, // Adicione se necessário
    situacao: tarefaData.situacao,
    dataAtualizacao: agora,
    userId: this.userId
  });
  },

  'tarefas.atualizar': async function(tarefaId: string, tarefaData: TarefaData) {
  check(tarefaId, String);
  check(tarefaData, {
    titulo: String,
    descricao: Match.Maybe(String),
    situacao: String
  });

  if (!this.userId) {
    throw new Meteor.Error('not-authorized', 'Usuário não autenticado');
  }

  const tarefa = await TarefasCollection.findOneAsync({
    _id: tarefaId,
    userId: this.userId
  });

  if (!tarefa) {
    throw new Meteor.Error('not-found', 'Tarefa não encontrada');
  }

  return await TarefasCollection.updateAsync(tarefaId, {
    $set: {
      titulo: tarefaData.titulo,
      descricao: tarefaData.descricao,
      situacao: tarefaData.situacao,
      dataAtualizacao: new Date()
    }
  });
  },
'tarefas.remover': async function(tarefaId: string) {
  check(tarefaId, String);

  if (!this.userId) {
    throw new Meteor.Error('not-authorized', 'Usuário não autenticado');
  }

  const tarefa = await TarefasCollection.findOneAsync({
    _id: tarefaId,
    userId: this.userId
  });

  if (!tarefa) {
    throw new Meteor.Error('not-found', 'Tarefa não encontrada');
  }

  return await TarefasCollection.removeAsync(tarefaId);
}
});

// Publicações
if (Meteor.isServer) {
  // Publicação para as tarefas do usuário
  Meteor.publish('tarefas.usuario', function() {
    if (!this.userId) {
      return this.ready();
    }

    return TarefasCollection.find(
      { userId: this.userId },
      { sort: { dataAtualizacao: -1 } }
    );
  });

  // Publicação para as últimas tarefas (para a tela inicial)
  Meteor.publish('tarefas.recentes', function(limit: number = 5) {
    check(limit, Number);
    
    if (!this.userId) {
      return this.ready();
    }

    return TarefasCollection.find(
      { userId: this.userId },
      { 
        sort: { dataAtualizacao: -1 },
        limit: limit
      }
    );
  });
}

