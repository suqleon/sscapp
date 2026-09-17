import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar, Divider, Screen, ScreenHeader, Txt } from '@/components/ui';
import { body, colors, head } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { getConversations } from '@/data/mockData';

export default function MessagesScreen() {
  const { profile } = useAppState();
  const conversations = getConversations(profile);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [extra, setExtra] = useState<Record<string, { from: 'me' | 'them'; text: string }[]>>({});
  const open = conversations.find((c) => c.id === openId);

  function send() {
    if (!draft.trim() || !open) return;
    setExtra((prev) => ({ ...prev, [open.id]: [...(prev[open.id] ?? []), { from: 'me', text: draft.trim() }] }));
    setDraft('');
  }

  if (open) {
    const thread = [...open.thread, ...(extra[open.id] ?? [])];
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <Screen style={{ paddingBottom: 12 }}>
          <ScreenHeader title={open.name} onBack={() => setOpenId(null)} />
          <View style={{ flex: 1, gap: 10, marginTop: 4 }}>
            {thread.map((m, i) => (
              <View key={i} style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                <Txt size={13.5} color={m.from === 'me' ? '#fff' : colors.navy}>{m.text}</Txt>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <View style={styles.inputWrap}>
              <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Escribe un mensaje…" placeholderTextColor={colors.faint} style={styles.input} returnKeyType="send" />
            </View>
            <Pressable onPress={send} style={[styles.send, { backgroundColor: profile.accent }]} accessibilityLabel="Enviar">
              <Feather name="send" size={19} color="#fff" />
            </Pressable>
          </View>
        </Screen>
      </KeyboardAvoidingView>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Mensajes"
        right={
          <View style={[styles.newBtn, { backgroundColor: profile.accent }]}>
            <Feather name="plus" size={20} color="#fff" />
          </View>
        }
      />
      <View style={styles.search}>
        <Feather name="search" size={18} color={colors.faint} />
        <Txt size={13.5} color={colors.faint}>Buscar conversación</Txt>
      </View>

      {conversations.map((c, i) => (
        <View key={c.id}>
          <Pressable onPress={() => setOpenId(c.id)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
            {c.initial ? (
              <Avatar initial={c.initial} colorsPair={[c.color, c.color]} size={50} rounded={25} />
            ) : (
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={c.id === 'grupo' ? 'users' : c.id === 'admin' ? 'home' : 'inbox'} size={22} color="#fff" />
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[head(700), { fontSize: 14.5, color: colors.navy }]}>{c.name}</Text>
                <Txt size={11} color={colors.faint}>{c.time}</Txt>
              </View>
              <Txt size={12.5} color={colors.muted} numberOfLines={1} style={{ marginTop: 3 }}>{c.preview}</Txt>
            </View>
            {c.unread > 0 && (
              <View style={[styles.unread, { backgroundColor: profile.accent }]}>
                <Txt size={11} w={700} color="#fff">{c.unread}</Txt>
              </View>
            )}
          </Pressable>
          {i < conversations.length - 1 && <Divider inset={63} />}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  newBtn: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, paddingHorizontal: 4 },
  unread: { width: 21, height: 21, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bubble: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, maxWidth: '80%' },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: colors.blue },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  inputWrap: { flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 15, justifyContent: 'center' },
  input: { ...body(500), fontSize: 14, color: colors.navy, paddingVertical: 12 },
  send: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
