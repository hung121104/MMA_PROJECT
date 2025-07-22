import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputError: {
    borderColor: "#dc3545",
    backgroundColor: "#fff5f5",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    padding: 0,
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginTop: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a6ef7",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e7f3ff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2a6ef7",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
