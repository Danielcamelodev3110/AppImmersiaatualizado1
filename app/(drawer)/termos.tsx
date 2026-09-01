import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DocumentosLegaisScreen() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<"termos" | "privacidade">("termos");

  return (
    <View style={styles.container}>
      {/* HEADER / HERO CONTAINER */}
      <View style={styles.heroContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#584128" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/imagem-fundo-immersia.png")}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>DOCUMENTOS LEGAIS</Text>
          <Text style={styles.heroSubtitle}>
            Última atualização: 26 de maio de 2026
          </Text>
        </View>
      </View>

      {/* SELETOR DE ABAS (TABS) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            abaAtiva === "termos" && styles.tabButtonActive,
          ]}
          onPress={() => setAbaAtiva("termos")}
        >
          <Feather
            name="file-text"
            size={18}
            color={abaAtiva === "termos" ? "#FFF" : "#584128"}
          />
          <Text
            style={[
              styles.tabText,
              abaAtiva === "termos" && styles.tabTextActive,
            ]}
          >
            Termos de Uso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            abaAtiva === "privacidade" && styles.tabButtonActive,
          ]}
          onPress={() => setAbaAtiva("privacidade")}
        >
          <Feather
            name="shield"
            size={18}
            color={abaAtiva === "privacidade" ? "#FFF" : "#584128"}
          />
          <Text
            style={[
              styles.tabText,
              abaAtiva === "privacidade" && styles.tabTextActive,
            ]}
          >
            Privacidade
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO DINÂMICO */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {abaAtiva === "termos" ? (
          <View style={styles.documentContainer}>
            <Text style={styles.titleDocumento}>TERMOS DE USO — IMMERSIA</Text>
            <Text style={styles.paragrafoInicial}>
              Bem-vindo à Immersia. Estes Termos de Uso regulam o acesso e a
              utilização do aplicativo, site e serviços oferecidos pela
              Immersia. Ao utilizar a plataforma, você declara que leu,
              compreendeu e concorda com os presentes Termos.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. SOBRE A IMMERSIA</Text>
              <Text style={styles.texto}>
                A Immersia é uma plataforma digital destinada à divulgação,
                intermediação e comercialização de:
              </Text>
              <Text style={styles.bullet}>• Experiências turísticas;</Text>
              <Text style={styles.bullet}>• Hospedagens;</Text>
              <Text style={styles.bullet}>• Pacotes de viagens;</Text>
              <Text style={styles.bullet}>
                • Atividades culturais, gastronômicas e de lazer;
              </Text>
              <Text style={styles.bullet}>
                • Roteiros turísticos em território brasileiro.
              </Text>
              <Text style={styles.textoNota}>
                A Immersia atua como intermediadora entre usuários e parceiros
                comerciais responsáveis pela prestação final dos serviços
                anunciados.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. CADASTRO DO USUÁRIO</Text>
              <Text style={styles.texto}>
                Para utilizar determinadas funcionalidades, o usuário deverá
                criar uma conta, fornecendo informações verdadeiras, completas e
                atualizadas. O usuário declara ser maior de 18 anos ou
                legalmente representado por responsável autorizado.
              </Text>
              <Text style={styles.subtoptico}>
                O usuário é responsável por:
              </Text>
              <Text style={styles.bullet}>
                • Manter a confidencialidade de sua conta e senha;
              </Text>
              <Text style={styles.bullet}>
                • Todas as atividades realizadas em sua conta;
              </Text>
              <Text style={styles.bullet}>
                • Atualizar seus dados sempre que necessário.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. SERVIÇOS OFERECIDOS</Text>
              <Text style={styles.texto}>
                A Immersia disponibiliza uma plataforma para busca, comparação,
                reserva e compra de experiências e serviços turísticos como
                hospedagens, guias e passeios. As condições específicas de cada
                serviço (preços, datas, cancelamentos) serão apresentadas de
                forma clara no momento da contratação.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. PAGAMENTOS</Text>
              <Text style={styles.texto}>
                Ao concluir uma compra, o usuário autoriza a cobrança do valor
                informado e concorda com as condições da oferta. A Immersia
                utiliza intermediadores de pagamento terceirizados, não sendo
                responsável por falhas exclusivas destas plataformas.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                5. CANCELAMENTOS E REEMBOLSOS
              </Text>
              <Text style={styles.texto}>
                As regras de cancelamento e reembolso variam conforme o parceiro
                responsável, o tipo de experiência e a antecedência da
                solicitação. A Immersia observa integralmente o Código de Defesa
                do Consumidor (CDC), incluindo o direito de arrependimento.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                6. RESPONSABILIDADES DA IMMERSIA
              </Text>
              <Text style={styles.texto}>
                A plataforma se compromete com o bom funcionamento do app e com
                a intermediação segura. No entanto, não se responsabiliza pela
                execução inadequada do serviço por parte dos parceiros,
                informações incorretas de terceiros ou eventos de força maior.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                7. RESPONSABILIDADES DOS PARCEIROS
              </Text>
              <Text style={styles.texto}>
                Os parceiros anunciantes são integralmente responsáveis pela
                prestação dos serviços ofertados, veracidade das informações,
                qualidade, segurança e cumprimento das normas legais.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. CONDUTA DO USUÁRIO</Text>
              <Text style={styles.texto}>
                O usuário compromete-se a utilizar a plataforma de forma lícita,
                não praticar fraudes, não violar direitos de terceiros, não
                inserir conteúdos ofensivos e não tentar acessar áreas restritas
                do sistema.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                9. PROPRIEDADE INTELECTUAL
              </Text>
              <Text style={styles.texto}>
                Todo o conteúdo da Immersia (marca, identidade visual, textos,
                layout, software) é protegido por lei. É proibida a reprodução
                ou utilização sem autorização prévia por escrito.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. LEGISLAÇÃO E FORO</Text>
              <Text style={styles.texto}>
                Estes Termos são regidos pelas leis da República Federativa do
                Brasil, em conformidade com a LGPD. Fica eleito o foro da
                comarca do domicílio do consumidor.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.documentContainer}>
            <Text style={styles.titleDocumento}>POLÍTICA DE PRIVACIDADE</Text>
            <Text style={styles.paragrafoInicial}>
              A Immersia valoriza a privacidade e a proteção dos dados pessoais
              de seus usuários. Esta Política explica quais dados coletamos,
              como utilizamos, com quem compartilhamos e quais são os seus
              direitos.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. DADOS COLETADOS</Text>
              <Text style={styles.subtoptico}>Dados Cadastrais:</Text>
              <Text style={styles.bullet}>
                • Nome completo, CPF, e-mail, telefone e data de nascimento.
              </Text>

              <Text style={styles.subtoptico}>Dados de Pagamento:</Text>
              <Text style={styles.bullet}>
                • Informações financeiras para processamento e histórico de
                compras.
              </Text>

              <Text style={styles.subtoptico}>Dados de Navegação:</Text>
              <Text style={styles.bullet}>
                • Endereço IP, localização aproximada, cookies e dados do
                dispositivo.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                2. FINALIDADES DO USO DOS DADOS
              </Text>
              <Text style={styles.texto}>
                Utilizamos os seus dados coletados estritamente para:
              </Text>
              <Text style={styles.bullet}>
                • Criar e gerenciar contas na plataforma;
              </Text>
              <Text style={styles.bullet}>
                • Processar pagamentos de reservas de segurança;
              </Text>
              <Text style={styles.bullet}>
                • Personalizar recomendações de viagens e roteiros;
              </Text>
              <Text style={styles.bullet}>
                • Prevenir fraudes cibernéticas e cumprir obrigações legais.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                3. COMPARTILHAMENTO DE DADOS
              </Text>
              <Text style={styles.texto}>
                Os dados poderão ser compartilhados com parceiros turísticos
                (hotéis, operadores locais), processadores de pagamento e
                fornecedores de tecnologia necessários para a operação. A
                Immersia <Text style={{ fontWeight: "bold" }}>não vende</Text>{" "}
                dados pessoais.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                4. ARMAZENAMENTO E SEGURANÇA
              </Text>
              <Text style={styles.texto}>
                Adotamos medidas técnicas avançadas de segurança para blindar as
                informações contra acessos não autorizados ou vazamentos. Os
                dados são mantidos pelo tempo necessário exigido por lei.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. SEUS DIREITOS (LGPD)</Text>
              <Text style={styles.texto}>
                Nos termos da Lei Geral de Proteção de Dados (Lei nº
                13.709/2018), você pode solicitar a qualquer momento a
                confirmação, correção, exclusão ou portabilidade dos seus dados
                coletados.
              </Text>
            </View>

            <View style={styles.sectionContato}>
              <Text style={styles.sectionTitleContato}>
                6. CENTRAL DE ATENDIMENTO
              </Text>
              <Text style={styles.textoContato}>
                Para dúvidas sobre privacidade ou requisições de dados:
              </Text>
              <View style={styles.contatoRow}>
                <Feather name="mail" size={14} color="#584128" />
                <Text style={styles.contatoLink}>
                  privacidade@immersia.com.br
                </Text>
              </View>
              <View style={styles.contatoRow}>
                <Feather name="help-circle" size={14} color="#584128" />
                <Text style={styles.contatoLink}>suporte@immersia.com.br</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEAE0",
  },
  heroContainer: {
    height: 140,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 11,
    color: "#E4D5BE",
    textAlign: "center",
    marginTop: 4,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E4D5BE",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#4A3B2C",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: "#584128",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#584128",
  },
  tabTextActive: {
    color: "#FFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  documentContainer: {
    backgroundColor: "#FFF",
    marginTop: 15,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#4A3B2C",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titleDocumento: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A3B2C",
    textAlign: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E4D5BE",
    paddingBottom: 8,
  },
  paragrafoInicial: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#584128",
    marginBottom: 6,
  },
  texto: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    textAlign: "justify",
  },
  subtoptico: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3B2C",
    marginTop: 8,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    paddingLeft: 10,
    marginBottom: 2,
  },
  textoNota: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#666",
    backgroundColor: "#EDEAE0",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#584128",
  },
  sectionContato: {
    backgroundColor: "#EDEAE0",
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4A3B2C",
    marginTop: 10,
  },
  sectionTitleContato: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A3B2C",
    marginBottom: 6,
  },
  textoContato: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  contatoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  contatoLink: {
    fontSize: 14,
    color: "#584128",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
