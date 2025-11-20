import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { userId, email, password } = await req.json();

    console.log(`Corrigindo usuário: ${email} (ID: ${userId})`);

    // Buscar o nome do usuário na tabela usuarios
    const { data: usuarioData, error: usuarioError } = await supabaseAdmin
      .from("usuarios")
      .select("nome")
      .eq("id", userId)
      .single();

    if (usuarioError) {
      console.error("Erro ao buscar usuário:", usuarioError);
      throw new Error("Usuário não encontrado");
    }

    // 1. Criar usuário no Supabase Auth com user_metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: email.split('@')[0] // Usar parte antes do @ como username
      }
    });

    if (authError) {
      console.error("Erro ao criar usuário no Auth:", authError);
      throw authError;
    }

    console.log(`Usuário criado no Auth com ID: ${authData.user.id}`);

    // 2. Atualizar a tabela usuarios com o auth_user_id
    const { error: updateError } = await supabaseAdmin
      .from("usuarios")
      .update({ auth_user_id: authData.user.id })
      .eq("id", userId);

    if (updateError) {
      console.error("Erro ao atualizar tabela usuarios:", updateError);
      throw updateError;
    }

    console.log(`Tabela usuarios atualizada com sucesso`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usuário corrigido com sucesso",
        auth_user_id: authData.user.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro na função fix-user-auth:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
