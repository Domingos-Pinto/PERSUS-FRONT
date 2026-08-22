import { useEffect, useState } from "react";
import { FaUserPlus, FaLock, FaLockOpen } from "react-icons/fa";
import {
  listEmployeesRequest,
  createEmployeeRequest,
  blockUserRequest,
  unblockUserRequest,
} from "../../service/authApi";
import { toast } from "../ui/Toast";

function EmployeesPanel() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadEmployees = () => {
    setLoading(true);
    listEmployeesRequest()
      .then(setEmployees)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createEmployeeRequest(form);
      setForm({ name: "", email: "", phone: "", password: "" });
      toast.success("Funcionário cadastrado com sucesso.");
      loadEmployees();
    } catch (err) {
      toast.error(err.message || "Não foi possível cadastrar.");
    } finally {
      setCreating(false);
    }
  };

  const toggleBlock = async (employee) => {
    setBusyId(employee.id);
    try {
      if (employee.status === "blocked") {
        await unblockUserRequest(employee.id);
        toast.success(`${employee.name} foi desbloqueado.`);
      } else {
        await blockUserRequest(employee.id);
        toast.success(`${employee.name} foi bloqueado.`);
      }
      loadEmployees();
    } catch (err) {
      toast.error(err.message || "Não foi possível atualizar o funcionário.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold text-zinc-800">
          Cadastrar funcionário
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Nome
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange("name")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Telefone
            </label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={handleChange("phone")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange("password")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          <FaUserPlus />
          {creating ? "A cadastrar..." : "Cadastrar funcionário"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-zinc-800 mb-4">
          Funcionários
        </h2>

        {loading && <p className="text-sm text-zinc-400">A carregar...</p>}

        {!loading && employees.length === 0 && (
          <p className="text-sm text-zinc-400">
            Ainda não há funcionários cadastrados.
          </p>
        )}

        <div className="space-y-3">
          {employees.map((employee) => {
            const blocked = employee.status === "blocked";
            return (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {employee.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {employee.email} · {employee.phone}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={busyId === employee.id}
                  onClick={() => toggleBlock(employee)}
                  className={`inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 transition disabled:opacity-60 ${
                    blocked
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {blocked ? <FaLockOpen /> : <FaLock />}
                  {busyId === employee.id
                    ? "A processar..."
                    : blocked
                      ? "Desbloquear"
                      : "Bloquear"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPanel;
