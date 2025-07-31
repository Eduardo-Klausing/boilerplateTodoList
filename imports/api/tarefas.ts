import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';


interface Tarefa {
  _id: string;
  descricao: string;
  situacao: 'Não concluída' | 'Concluída';
  dataAtualizacao: Date;
  pessoal: boolean;
  userId: string;
}

export const TarefasCollection = new Mongo.Collection<Tarefa>('tarefas');

// Definição da interface para os dados do formulário
interface TarefaData {
  descricao: string;
  situacao: 'Não concluída' | 'Concluída';
  pessoal: boolean;
}

// Métodos 
Meteor.methods({
  'tarefas.inserir': async function(tarefaData: TarefaData) {
  check(tarefaData, {
    descricao: Match.Maybe(String),
    situacao: String,
    pessoal: Boolean,
  });

  if (!this.userId) {
    throw new Meteor.Error('not-authorized', 'Usuário não autenticado');
  }

  const agora = new Date();

  return await TarefasCollection.insertAsync({
    descricao: tarefaData.descricao, // Adicione se necessário
    situacao: tarefaData.situacao,
    dataAtualizacao: agora,
    pessoal: tarefaData.pessoal,
    userId: this.userId
  });
  },

  'tarefas.atualizar': async function(tarefaId: string, tarefaData: TarefaData) {
  check(tarefaId, String);
  check(tarefaData, {
    descricao: Match.Maybe(String),
    situacao: String,
    pessoal: Boolean,
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
      descricao: tarefaData.descricao,
      situacao: tarefaData.situacao,
      dataAtualizacao: new Date(),
      pessoal: tarefaData.pessoal,
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
    // Retorna tarefas pessoais do usuário logado e tarefas não pessoais de todos
 return TarefasCollection.find({
  $or: [
    { pessoal: true, userId: this.userId },
    { pessoal: { $ne: true } } // ou { pessoal: false }
    ]
    }, { sort: { dataAtualizacao: -1 } });
  });

  // Publicação para as últimas tarefas (para a tela inicial)
  Meteor.publish('tarefas.recentes', function(limit: number = 5) {
    check(limit, Number);
    
    if (!this.userId) {
      return this.ready();
    }

    return TarefasCollection.find({
    $or: [{ pessoal: true, userId: this.userId }, { pessoal: { $ne: true } }]
    }, { 
        sort: { dataAtualizacao: -1 },
        limit: limit
      });
  });
}

